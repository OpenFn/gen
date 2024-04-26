import logging
from util import DictObj

from .utils import (
    generate_code_prompt,
)

from inference.inference import generate


logging.basicConfig(level=logging.INFO)


class Payload(DictObj):
    api_key: str
    signature: str
    model: str


# generate adaptr code based on a model and signature
def main(dataDict) -> str:
    data = Payload(dataDict)

    prompt = generate_code_prompt(data.model, data.signature)
    result = generate(data.model, prompt, {"key": data.get("api_key")})

    return result
