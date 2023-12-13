import logging
from fastapi import APIRouter
from signature_generator.utils.models import SignatureGenerator, SignatureInput
from signature_generator.utils.prompts import generate_prompt
from signature_generator.utils.utils import (
    extract_api_info,
    get_model_endpoint,
    parse_openapi_spec,
)

# Configure logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/generate_signature")
async def generate_signature(data: SignatureInput) -> dict:
    """
    Generate signature for a given OpenAPI spec and instruction.
    """
    logger.info(f"Generating signature for model {data.model}")
    generator = SignatureGenerator(get_model_endpoint(data.model))

    logger.info("Parsing OpenAPI specification")
    parsed_spec = parse_openapi_spec(data.open_api_spec)

    logger.info("Extracting API information from parsed spec with provided instruction")
    api_info = extract_api_info(parsed_spec, data.instruction)

    prompt_template = "signature" if data.model == "gpt3_turbo" else "signature_text"
    prompt = generate_prompt(
        prompt_template, spec=api_info, instruction=data.instruction
    )

    logger.info(f"Generating {data.model} prompt for signature generation")
    signature = generator.generate(prompt)[0]

    end_tokens = "==="
    if end_tokens in signature:
        logger.info("Trimming the signature at the end token")
        signature = signature[: signature.find(end_tokens)]
    else:
        logger.warning("End token not found in the signature")

    logger.info("Signature generation complete")
    return {"signature": signature}
