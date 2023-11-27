import logging
import os
import torch

from transformers import LlamaForCausalLM, LlamaTokenizer

# Create a logger
logger = logging.getLogger(__name__)

HF_ACCESS_TOKEN = os.getenv(
    "HF_ACCESS_TOKEN",
)


class Llama2_7B:
    def __init__(self):
        print("init")
        # self.tokenizer = LlamaTokenizer.from_pretrained(
        #     "data/Llama-2-7b-hf-16/tokenizer", local_files_only=True
        # )
        # self.model = LlamaForCausalLM.from_pretrained(
        #     "data/Llama-2-7b-hf-16/model", local_files_only=True
        # )
        # self.tokenizer = LlamaTokenizer.from_pretrained(
        #     "meta-llama/Llama-2-7b-hf",
        #     # torch_dtype=torch.bfloat16,
        #     trust_remote_code=True,
        #     token=HF_ACCESS_TOKEN,
        # )
        # self.tokenizer.save_pretrained("data/Llama-2-7b-hf-16/tokenizer")
        # self.model = LlamaForCausalLM.from_pretrained(
        #     "meta-llama/Llama-2-7b-hf",
        #     # torch_dtype=torch.bfloat16,
        #     trust_remote_code=True,
        #     token=HF_ACCESS_TOKEN,
        # )
        # self.model.save_pretrained("data/Llama-2-7b-hf-16/model")

    def generate(
        self, text: str, max_length: int = 1024, num_return_sequences: int = 1
    ) -> str:
        """
        Generates text using the meta-llama/Llama-2-7b-hf model
        :param text: Input text to generate continuation from
        :param max_length: Maximum length of the generated text
        :param num_return_sequences: Number of text sequences to return
        :return: Generated text in a list
        """
        try:
            inputs = self.tokenizer(
                text, return_tensors="pt", max_length=max_length, truncation=True
            )
            outputs = self.model.generate(
                inputs.input_ids,
                max_length=max_length,
                num_return_sequences=num_return_sequences,
            )
            response = [
                self.tokenizer.decode(output, skip_special_tokens=True)
                for output in outputs
            ]
            return response
        except Exception as e:
            logger.error(f"An error occurred during Llama-2-7B generation: {e}")
            return None
