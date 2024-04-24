import logging

from transformers import RobertaTokenizer, T5ForConditionalGeneration

# Create a logger
logger = logging.getLogger(__name__)


class CodeT5:
    def __init__(self):
        # Initialize the CodeT5 model with the pretrained model and tokenizer
        self.model_name = "Salesforce/codet5-base"
        self.tokenizer = RobertaTokenizer.from_pretrained(self.model_name)
        self.model = T5ForConditionalGeneration.from_pretrained(self.model_name)
        logger.info(f"Model {self.model_name} loaded.")

    def generate_code(
        self,
        text: str,
        max_length: int = 1024,
        num_return_sequences: int = 1,
    ) -> list[str]:
        """
        Generate code from text using the CodeT5 model
        :param text: Input text to generate code
        :param max_length: Maximum length of the generated code
        :param num_return_sequences: Number of code sequences to return
        :return: Generated code in a list
        """
        try:
            # Encode the text and generate the code
            input_ids = self.tokenizer.encode(text, return_tensors="pt")
            outputs = self.model.generate(
                input_ids,
                max_length=max_length,
                num_return_sequences=num_return_sequences,
            )
            response = [
                self.tokenizer.decode(output, skip_special_tokens=True)
                for output in outputs
            ]
            return response
        except Exception as e:
            # logs error if an exception occurs during code generation
            logger.error(f"An error occurred during code generation: {e}")
            return None
