from fastapi import APIRouter

from signature_generator.utils.models import SignatureGenerator, SignatureInput, get_model_endpoint
from signature_generator.utils.prompts import generate_prompt

router = APIRouter()


@router.post("/generate_signature")
async def generate_signature(data: SignatureInput) -> object:
    """
    Generate signature for a given OpenAPI spec and instruction.
    """
    generator = SignatureGenerator(get_model_endpoint(data.model_name))
    prompt = generate_prompt("signature", spec=data.open_api_spec, instruction=data.instruction)
    signature = generator.generate(prompt)[0]

    end_tokens = "==="

    if end_tokens in signature:
        signature = signature[: signature.find(end_tokens)]

    return {"generated_signature": signature}
