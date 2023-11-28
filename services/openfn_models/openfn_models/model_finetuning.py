import datetime
from datasets import load_dataset
import torch
from transformers import (
    AutoModelForCausalLM,
    BitsAndBytesConfig,
    AutoTokenizer,
    TrainingArguments,
)
from peft import LoraConfig
from trl import SFTTrainer
import os

run_name = "llama2-7b-openfn"


class ModelFinetuner:
    def __init__(self, dataset_name, base_model_name, output_dir="./results"):
        self.dataset_name = dataset_name
        self.base_model_name = base_model_name
        self.output_dir = output_dir

        # self.dataset = load_dataset(self.dataset_name, split="train")
        self.dataset = load_dataset(
            "json", data_files="data/adaptors/adaptor_functions_prompts.json"
        )
        print(self.dataset)
        self.bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_use_double_quant=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.float16,
        )
        self.device_map = {"": 0}
        self.base_model = self.load_base_model()
        self.peft_config = self.configure_peft()
        self.tokenizer = self.load_tokenizer()
        self.training_args = self.configure_training_args()
        self.max_seq_length = 512

    def load_base_model(self):
        base_model = AutoModelForCausalLM.from_pretrained(
            self.base_model_name,
            quantization_config=self.bnb_config,
            device_map=self.device_map,
            trust_remote_code=True,
            use_auth_token=True,
        )
        base_model.config.use_cache = False
        base_model.config.pretraining_tp = (
            1  # More info: https://github.com/huggingface/transformers/pull/24906
        )
        return base_model

    def configure_peft(self):
        return LoraConfig(
            lora_alpha=16,
            lora_dropout=0.1,
            r=64,
            bias="none",
            task_type="CAUSAL_LM",
        )

    def load_tokenizer(self):
        tokenizer = AutoTokenizer.from_pretrained(
            self.base_model_name,
            padding_side="left",
            add_eos_token=True,
            add_bos_token=True,
            trust_remote_code=True,
        )
        tokenizer.pad_token = tokenizer.eos_token
        return tokenizer

    def tokenize_prompt(self, prompt):
        return self.tokenizer(prompt, return_tensors="pt")

    def configure_training_args(self):
        return TrainingArguments(
            output_dir=self.output_dir,
            auto_find_batch_size=True,
            gradient_accumulation_steps=2,
            warm_up_step=1,
            fp16=True,
            optim="paged_adamw_8bit",
            learning_rate=2e-4,
            logging_steps=10,
            max_steps=500,
            logging_dir="./logs",
            save_strategy="steps",
            save_steps=10,
            evaluation_strategy="steps",
            eval_steps=10,
            do_eval=True,
            lr_scheduler_type="constant",
            group_by_length=True,
            num_train_epochs=6,
            run_name=f"{run_name}-{datetime.now().strftime('%Y-%m-%d-%H-%M')}",
        )

    def train(self):
        trainer = SFTTrainer(
            model=self.base_model,
            train_dataset=self.dataset,
            eval_dataset=self.eval_dataset,
            peft_config=self.peft_config,
            dataset_text_field="text",
            max_seq_length=self.max_seq_length,
            tokenizer=self.tokenizer,
            args=self.training_args,
        )
        trainer.train()

    def save_checkpoint(self):
        final_checkpoint_dir = os.path.join(self.output_dir, "final_checkpoint")
        os.makedirs(final_checkpoint_dir, exist_ok=True)
        self.trainer.model.save_pretrained(final_checkpoint_dir)


# Example usage:
project = ModelFinetuner(
    "iamtarun/python_code_instructions_18k_alpaca", "meta-llama/Llama-2-7b-hf"
)

train_ds = load_dataset("json", data_files="data/processed_data/train.json")

test_ds = load_dataset("json", data_files="data/processed_data/test.json")
print(train_ds)
train_ds = train_ds.remove_columns(
    ["instruction", "signature", "name", "test", "implementation"]
)
test_ds = test_ds.remove_columns(
    ["instruction", "signature", "name", "test", "implementation"]
)
print(test_ds)
# print(dataset)
# tokenized_dataset = dataset["prompt"].map(project.tokenize_prompt)
# print(tokenized_dataset)
# train_dataset.map(lambda x: x["prompt"])


# project.train()
# project.save_checkpoint()
