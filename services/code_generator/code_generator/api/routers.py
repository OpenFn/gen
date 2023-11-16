import logging

from fastapi import APIRouter

from code_generator.utils.models import CodeGenerator, CodeInput
from code_generator.utils.prompts import generate_prompt
from code_generator.utils.utils import get_model_endpoint

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/generate_code")
async def generate_code(data: CodeInput) -> object:
    """
    Generate code implementation for a given OpenAPI spec and instruction.
    """
    generator = CodeGenerator(get_model_endpoint(data.model))

    prompt = generate_prompt("code_text", signature=data.signature)
    signature = generator.generate(prompt)[0]

    return {"implementation": signature}
