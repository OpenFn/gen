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
    if data.model == "gpt3_turbo":
        prompt_template = "code"
    elif data.model == "gpt_ft":
        prompt_template = "code_ft"
    elif data.model == "llama2":
        prompt_template = "llama2"
    else:
        prompt_template = "code_text"

    print(prompt_template)
    prompt = generate_prompt(prompt_template, signature=data.signature)
    print(prompt)
    code = generator.generate(prompt)[0]

    return {"implementation": code}
