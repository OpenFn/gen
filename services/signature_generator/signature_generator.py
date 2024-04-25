import logging
from typing import Union

from .prompts import generate_prompt
from .utils import (
    extract_api_info,
    get_model_endpoint,
    parse_openapi_spec,
    trim_signature,
)

from inference.inference import generate

# TODO the platform should deal with logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Parse the incoming dict into an object that's a bit nicer to use
# TODO surely I can automate this somehow?
# fastapi seems to do it pretty well
class Payload:
  open_api_spec: Union[str, dict]
  instruction: str
  model: str = "codet5"

  def __init__(self, dict):
    self.model = dict['model']
    self.open_api_spec = dict['open_api_spec']
    self.instruction = dict['instruction']
    self.api_key = dict['api_key'] if 'api_key' in dict else None

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
    
    prompt = generate_prompt(
        prompt_template, spec=api_info, instruction=data.instruction
    )

    signature = generate(data.model, prompt, data.api_key).result
    signature = trim_signature(signature)

    logger.info("Signature generation complete")
    logger.info(signature)
    return {"signature": signature}


if __name__ == "__main__":
  main({ 'model': 'turbo' })