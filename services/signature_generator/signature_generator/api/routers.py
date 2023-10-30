from fastapi import APIRouter

from signature_generator.utils.constants import CODET5_ENDPOINT
from signature_generator.utils.models import SignatureGenerator, SignatureInput
from signature_generator.utils.prompts import generate_prompt

router = APIRouter()

signature_generator = SignatureGenerator(CODET5_ENDPOINT)


@router.post("/generate_signature")
async def generate_signature(data: SignatureInput) -> object:
    """
    Generate signature for a given OpenAPI spec and instruction.
    """
    prompt = generate_prompt("signature", spec=data.open_api_spec, instruction=data.instruction)
    generated_signature = signature_generator.generate(prompt)
    return {"generated_signature": generated_signature}
