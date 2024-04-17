import logging
from fastapi import APIRouter
from code_generator.utils.models import CodeInput, TestInput
from code_generator.utils.utils import (
    create_code_generator,
    generate_code_prompt,
    generate_test_prompt,
    trim_test,
)

router = APIRouter()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@router.post("/generate_code", response_model=dict)
async def generate_code(data: CodeInput) -> dict:
    generator = create_code_generator(data.model)
    prompt = generate_code_prompt(data.model, data.signature)
    logger.info("Code generation..")
    code = generator.generate(prompt)[0]
    return {"implementation": code}


@router.post("/generate_test", response_model=dict)
async def generate_test(data: TestInput) -> dict:
    generator = create_code_generator(data.model)
    prompt = generate_test_prompt(data.model, data.implementation)
    logger.info("Test generation..")
    test = generator.generate(prompt)[0]
    logger.info("Test generation complete.")
    return {"test": trim_test(test)}
