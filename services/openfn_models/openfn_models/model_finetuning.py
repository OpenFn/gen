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


class ModelFinetuner:
    def __init__(self, dataset_name, base_model_name, output_dir="./results"):
        self.dataset_name = dataset_name
        self.base_model_name = base_model_name
        self.output_dir = output_dir

        # self.dataset = load_dataset(self.dataset_name, split="train")
        self.dataset = load_dataset("json", data_files="../data/alpaca_data.json")
        print(self.dataset)
        self.bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
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
            # trust_remote_code=True,
            # use_auth_token=True,
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
            self.base_model_name, trust_remote_code=True
        )
        tokenizer.pad_token = tokenizer.eos_token
        return tokenizer

    def configure_training_args(self):
        return TrainingArguments(
            output_dir=self.output_dir,
            per_device_train_batch_size=4,
            gradient_accumulation_steps=4,
            learning_rate=2e-4,
            logging_steps=10,
            max_steps=500,
        )

    def train(self):
        trainer = SFTTrainer(
            model=self.base_model,
            train_dataset=self.dataset,
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
project.train()
project.save_checkpoint()
