import logging

from transformers import GPT2LMHeadModel, GPT2Tokenizer

# Create a logger
logger = logging.getLogger(__name__)


class GPT2:
    def __init__(self):
        self.tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
        self.model = GPT2LMHeadModel.from_pretrained("gpt2")

    def generate(self, text: str, max_length: int = 50, num_return_sequences: int = 1) -> str:
        """
        Generates text using the GPT-2 model
        :param text: Input text to generate continuation from
        :param max_length: Maximum length of the generated text
        :param num_return_sequences: Number of text sequences to return
        :return: Generated text in a list
        """
        try:
            inputs = self.tokenizer(text, return_tensors="pt", max_length=max_length, truncation=True)
            outputs = self.model.generate(
                inputs.input_ids,
                max_length=max_length,
                num_return_sequences=num_return_sequences,
            )
            response = [self.tokenizer.decode(output, skip_special_tokens=True) for output in outputs]
            return response
        except Exception as e:
            logger.error(f"An error occurred during GPT-2 generation: {e}")
            return None
