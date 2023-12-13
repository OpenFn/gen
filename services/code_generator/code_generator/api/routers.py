import logging
from fastapi import APIRouter
from code_generator.utils.models import CodeGenerator, CodeInput, TestInput
from code_generator.utils.prompts import generate_prompt
from code_generator.utils.utils import get_model_endpoint

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/generate_code")
async def generate_code(data: CodeInput) -> dict:
    """
    Generate code implementation for a given OpenAPI spec and instruction.
    """
    logger.info("Generating code...")
    generator = CodeGenerator(get_model_endpoint(data.model))
    prompt_template = (
        "code"
        if data.model == "gpt3_turbo"
        else "code_ft"
        if data.model == "gpt_ft"
        else "code_text"
    )
    prompt = generate_prompt(prompt_template, signature=data.signature)
    code = generator.generate(prompt)[0]
    logger.info("Code generation complete.")
    return {"implementation": code}


@router.post("/generate_test")
async def generate_test(data: TestInput) -> dict:
    """
    Generate test for a given adapter.js implementation.
    """
    logger.info("Generating test...")
    generator = CodeGenerator(get_model_endpoint(data.model))
    prompt = generate_prompt("test", implementation=data.implementation)
    test = generator.generate(prompt)[0]
    end_tokens = "/* Test */"
    if end_tokens in test:
        logger.info("Trimming the end token from test")
        test = test[test.find(end_tokens) :]
    else:
        logger.warning("End token not found in the test")
    logger.info("Test generation complete.")
    return {"test": test}
