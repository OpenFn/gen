import logging

from src.models import SignatureGenerator, SignatureInput
from src.prompts import generate_prompt
from src.utils import (
    extract_api_info,
    get_model_endpoint,
    parse_openapi_spec,
    trim_signature,
)

# TODO the platform should deal with logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


#async def main(data: SignatureInput) -> dict:

# Parse the incoming dict into an object that's a bit nicer to use
# TODO surely I can automate this somehow?
# fastapi seems to do it pretty well
class Payload:
  def __init__(self, dict):
    self.model = dict['model']
    self.open_api_spec = dict['open_api_spec']
    self.instruction = dict['instruction']

def main(dataDict) -> dict:
    data = Payload(dataDict)

    logger.info(f"Generating signature for model {data.model}")
    generator = SignatureGenerator(get_model_endpoint(data.model))

    logger.info("Parsing OpenAPI specification")
    parsed_spec = parse_openapi_spec(data.open_api_spec)

    logger.info("Extracting API information from parsed spec with provided instruction")
    api_info = extract_api_info(parsed_spec, data.instruction)

    prompt_template = "signature" if data.model == "gpt3_turbo" else "signature_text"
    logger.info(f"Generating {data.model} prompt for signature generation")
    
    prompt = generate_prompt(
        prompt_template, spec=api_info, instruction=data.instruction
    )

    signature = generator.generate(prompt)[0]
    signature = trim_signature(signature)

    logger.info("Signature generation complete")
    return {"signature": signature}
    return data


if __name__ == "__main__":
  main({ 'model': 'turbo' })