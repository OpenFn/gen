import logging

from .prompts import generate_prompt
from .utils import (
    extract_api_info,
    parse_openapi_spec,
    trim_signature,
)
from util import DictObj

from inference.inference import generate

# TODO the platform should deal with logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Payload(DictObj):
    api_key: str
    open_api_spec: str
    instruction: str


def main(dataDict) -> dict:
    data = Payload(dataDict)

    # TODO: validate args and throw if anything looks amiss

    logger.info(f"Generating signature for model {data.model}")

    logger.info("Parsing OpenAPI specification")
    parsed_spec = parse_openapi_spec(data.open_api_spec)

    logger.info("Extracting API information from parsed spec with provided instruction")
    api_info = extract_api_info(parsed_spec, data.instruction)

    prompt_template = "signature" if data.model == "gpt3_turbo" else "signature_text"
    logger.info(f"Generating {data.model} prompt for signature generation")

    prompt = generate_prompt(prompt_template, spec=api_info, instruction=data.instruction)
    signature = generate(data.model, prompt, {"key": data.get("api_key")})
    signature = trim_signature(signature)

    logger.info("Signature generation complete")
    return {"signature": signature}


# for local testing
if __name__ == "__main__":
    main({"model": "turbo"})
