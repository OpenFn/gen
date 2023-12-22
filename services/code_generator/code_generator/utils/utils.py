import logging
import os
from code_generator.utils.models import CodeGenerator
from code_generator.utils.prompts import generate_prompt

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_code_generator(model):
    return CodeGenerator(get_model_endpoint(model))


def generate_code_prompt(model, signature):
    prompt_template = (
        "code"
        if model == "gpt3_turbo"
        else "code_ft"
        if model == "gpt_ft"
        else "code_text"
    )
    return generate_prompt(prompt_template, signature=signature)


def generate_test_prompt(model, implementation):
    return generate_prompt("test", implementation=implementation)


def trim_test(test):
    end_tokens = "/* Test */"
    if end_tokens in test:
        logger.info("Trimming the end token from test")
        return test[test.find(end_tokens) :]
    else:
        logger.warning("End token not found in the test")
        return test


def get_model_endpoint(model_name: str) -> str:
    """
    Get the endpoint for the model
    """
    base_url = os.getenv("INFERENCE_BASEURL", "http://localhost:8003/")

    if model_name.lower() == "llama2":
        endpoint = (
            f"http://localhost:8005/llama2/generate_code/"  # Llama2 model is offline
        )
    else:
        endpoint = f"{base_url}{model_name.lower()}/generate_code/"

    return endpoint
