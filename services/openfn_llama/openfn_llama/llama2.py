import os
import torch
import logging
from peft import PeftModel
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
from huggingface_hub import login

logger = logging.getLogger(__name__)

HF_ACCESS_TOKEN = os.getenv(
    "HF_ACCESS_TOKEN",
)
login(token=HF_ACCESS_TOKEN)


class Llama2_7B:
    def __init__(self, finetuned_model="models/checkpoint-300", finetune=False):
        self.model_name = f"openfn_llama/{finetuned_model}"
        self.base_model_name = "meta-llama/Llama-2-7b-hf"
        self.finetune_flag = finetune

        self.bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_use_double_quant=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.float16,
        )
        self.tokenizer = self.load_tokenizer()
        self.base_model = self.load_base_model()
        self.peft_model = PeftModel.from_pretrained(self.base_model, finetuned_model)
        if not self.finetune_flag:
            self.peft_model.eval()
        logger.info(f"Model {self.model_name} loaded.")

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

    def load_base_model(self):
        base_model = AutoModelForCausalLM.from_pretrained(
            self.base_model_name,
            quantization_config=self.bnb_config,
            device_map="auto",
            trust_remote_code=True,
            use_auth_token=True,
        )
        if self.finetune_flag:
            base_model.config.use_cache = False
        base_model.config.pretraining_tp = 1
        return base_model

    def generate(
        self,
        prompt: str,
        max_length: int = 1024,
        num_return_sequences: int = 1,
        use_base_model=False,
    ) -> str:
        """
        Generates code using the meta-llama/Llama-2-7b-hf model finetune on OpenFn Adaptors. See dataset.
        :param text: Input text to generate continuation from
        :param max_length: Maximum length of the generated text
        :param num_return_sequences: Number of text sequences to return
        :return: Generated text in a list
        """
        try:
            inputs = self.tokenizer(
                prompt, return_tensors="pt", max_length=max_length, truncation=True
            ).to("cuda")
            with torch.no_grad():
                if use_base_model:
                    outputs = self.base_model.generate(
                        **inputs,
                        max_length=max_length,
                        num_return_sequences=num_return_sequences,
                        max_new_tokens=300,
                    )
                else:
                    outputs = self.peft_model.generate(
                        **inputs,
                        max_length=max_length,
                        num_return_sequences=num_return_sequences,
                        max_new_tokens=300,
                    )

            response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)

            return response
        except Exception as e:
            logger.error(f"An error occurred during Llama-2-7B generation: {e}")
            return None
