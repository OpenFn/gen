import logging

from fastapi import APIRouter

from signature_generator.utils.models import SignatureGenerator, SignatureInput
from signature_generator.utils.prompts import generate_prompt
from signature_generator.utils.utils import (
    extract_api_info,
    get_model_endpoint,
    parse_openapi_spec,
)

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/generate_signature")
async def generate_signature(data: SignatureInput) -> object:
    """
    Generate signature for a given OpenAPI spec and instruction.
    """
    generator = SignatureGenerator(get_model_endpoint(data.model))
    prompt_template = "signature" if data.model == "gpt3_turbo" else "signature_text"
    print(prompt_template)
    prompt = generate_prompt(
        prompt_template,
        spec=data.open_api_spec,
        instruction=data.instruction,
    )
    signature = generator.generate(prompt)[0]

    end_tokens = "==="

    if end_tokens in signature:
        signature = signature[: signature.find(end_tokens)]

    return {"generated_signature": signature}


@router.post("/generate_signature_v2")
async def generate_signature_v2(data: SignatureInput) -> object:
    """
    Generate signature for a given OpenAPI spec and instruction.
    """
    generator = SignatureGenerator(get_model_endpoint(data.model))

    parsed_spec = parse_openapi_spec(data.open_api_spec)
    api_info = extract_api_info(parsed_spec, data.instruction)
    prompt_template = "signature" if data.model == "gpt3_turbo" else "signature_text"
    print(f"prompt_template : {prompt_template}")
    prompt = generate_prompt(
        prompt_template, spec=api_info, instruction=data.instruction
    )
    print(prompt)
    signature = generator.generate(prompt)[0]

    end_tokens = "==="

    if end_tokens in signature:
        signature = signature[: signature.find(end_tokens)]

    return {"signature": signature}
