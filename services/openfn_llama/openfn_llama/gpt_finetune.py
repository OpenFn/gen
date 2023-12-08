from datetime import datetime
from datasets import load_dataset
import torch
from transformers import (
    AutoModelForCausalLM,
    BitsAndBytesConfig,
    AutoTokenizer,
    TrainingArguments,
    DataCollatorForLanguageModeling,
    Trainer,
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from trl import SFTTrainer
from huggingface_hub import login
import numpy as np

import matplotlib.pyplot as plt
import os

run_name = "gptj-6b-openfn"

HF_ACCESS_TOKEN = os.getenv(
    "HF_ACCESS_TOKEN",
)
print(HF_ACCESS_TOKEN)
login(token=HF_ACCESS_TOKEN)


class ModelFinetuner:
    def __init__(self, dataset_name, base_model_name, output_dir="./models"):
        self.dataset_name = dataset_name
        self.base_model_name = base_model_name
        self.output_dir = output_dir

        self.dataset = load_dataset("json", data_files=self.dataset_name)
        self.dataset = self.dataset.map(self.create_prompt_formats)
        self.dataset = self.dataset.shuffle()

        self.bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_use_double_quant=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.float16,
        )
        self.device_map = "auto"
        self.tokenizer = self.load_tokenizer()
        # self.tokenized_dataset = self.dataset.map(
        #     self.tokenize_function,
        #     batched=True,
        #     remove_columns=["input", "completion", "prompt"],
        # )
        # print(self.tokenized_dataset)
        self.base_model = self.load_base_model()
        self.peft_config = self.configure_peft()
        # self.model = prepare_model_for_kbit_training(self.base_model)
        # self.model = get_peft_model(self.model, self.peft_config)
        # self.print_trainable_parameters()
        self.training_args = self.configure_training_args()
        self.max_seq_length = 2048
        print("Finetuner initialised")

    def load_base_model(self):
        base_model = AutoModelForCausalLM.from_pretrained(
            self.base_model_name,
            quantization_config=self.bnb_config,
            device_map=self.device_map,
            trust_remote_code=True,
            token=True,
        )
        base_model.config.use_cache = False
        base_model.config.pretraining_tp = 1
        return base_model

    def configure_peft(self):
        return LoraConfig(
            r=32,
            lora_alpha=64,
            lora_dropout=0.05,
            target_modules=[
                "q_proj",
                "k_proj",
                "v_proj",
                "out_proj",
                # "fc_in",
                # "fc_out",
            ],
            bias="none",
            task_type="CAUSAL_LM",
        )

    def load_tokenizer(self):
        tokenizer = AutoTokenizer.from_pretrained(
            self.base_model_name,
            padding_side="right",
            add_eos_token=True,
            add_bos_token=True,
            trust_remote_code=True,
        )
        tokenizer.pad_token = tokenizer.eos_token
        return tokenizer

    def tokenize_function(self, sample):
        tokenized = self.tokenizer(
            sample["prompt"],
            truncation=True,
            max_length=2048,
            padding="max_length",
            return_tensors="pt",
        )
        return tokenized

    def create_prompt_formats(self, sample):
        sample[
            "prompt"
        ] = f"Below is a TypeScript Declaration with JsDoc that describes a tasks. Write a Javascript Implementation that approriately answers the task.\n{sample['input']}\n{sample['completion']}"
        return sample

    def plot_data_lengths(self, dataset):
        tokenized_dataset = dataset.map(self.tokenize_function, batched=True)
        print(tokenized_dataset)
        lengths = [
            len(input_ids) for input_ids in tokenized_dataset["train"]["input_ids"]
        ]

        print(f"Average length: {np.mean(lengths):.2f}")
        print(f"Median length: {np.median(lengths)}")
        print(f"Max length: {np.max(lengths)}")

        max_length = int(
            np.percentile(lengths, 95)
        )  # Setting max_length to the 95th percentile

        print(f"Chosen max_length: {max_length}")

        # Plotting the histogram
        plt.figure(figsize=(10, 6))
        plt.hist(lengths, bins=20, alpha=0.7, color="blue")
        plt.xlabel("Length of input_ids")
        plt.ylabel("Frequency")
        plt.title("Distribution of Lengths of input_ids")
        plt.show()
        plt.savefig("lengths_distribution.png")
        return max_length

    def print_trainable_parameters(self):
        """
        Prints the number of trainable parameters in the model.
        """

        trainable_params = 0
        all_param = 0
        for _, param in self.model.named_parameters():
            all_param += param.numel()
            if param.requires_grad:
                trainable_params += param.numel()
        print(
            f"trainable params: {trainable_params} || all params: {all_param} || trainable%: {100 * trainable_params / all_param}"
        )

    def configure_training_args(self):
        return TrainingArguments(
            output_dir=self.output_dir,
            auto_find_batch_size=True,
            gradient_accumulation_steps=2,
            # warm_up_step=1,
            fp16=True,
            optim="paged_adamw_8bit",
            learning_rate=2e-4,
            logging_steps=10,
            max_steps=500,
            logging_dir="./logs",
            save_strategy="steps",
            save_steps=50,
            evaluation_strategy="steps",
            eval_steps=50,
            do_eval=True,
            lr_scheduler_type="constant",
            group_by_length=True,
            num_train_epochs=2000,
            run_name=f"{run_name}-{datetime.now().strftime('%Y-%m-%d-%H-%M')}",
        )

    def train(self):
        dataset = self.dataset["train"].train_test_split(test_size=0.1)
        self.trainer = SFTTrainer(
            model=self.base_model,
            train_dataset=dataset["train"],
            eval_dataset=dataset["test"],
            peft_config=self.peft_config,
            dataset_text_field="prompt",
            max_seq_length=self.max_seq_length,
            tokenizer=self.tokenizer,
            args=self.training_args,
        )

        # dataset = self.tokenized_dataset.train_test_split(test_size=0.1)
        # trainer = Trainer(
        #     model=self.model,
        #     train_dataset=dataset["train"],
        #     eval_dataset=dataset["test"],
        #     args=self.training_args,
        #     data_collator=DataCollatorForLanguageModeling(self.tokenizer, mlm=False),
        # )
        # self.model.config.use_cache = False

        self.trainer.train()

    def save_checkpoint(self):
        final_checkpoint_dir = os.path.join(self.output_dir, "final_checkpoint")
        os.makedirs(final_checkpoint_dir, exist_ok=True)
        self.trainer.model.save_pretrained(final_checkpoint_dir)


project = ModelFinetuner("datasets/adaptors/dataset.jsonl", "EleutherAI/gpt-j-6b")

project.train()
project.save_checkpoint()
