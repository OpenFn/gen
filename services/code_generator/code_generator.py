import logging
from util import DictObj

from .utils import (
    generate_code_prompt,
)

from inference import inference


logging.basicConfig(level=logging.INFO, filename="out.txt")
logger = logging.getLogger(__name__)


class Payload(DictObj):
    api_key: str
    signature: str
    model: str


# generate adaptor code based on a model and signature
def main(dataDict) -> str:
    data = Payload(dataDict)

    result = generate(data.model, data.signature, data.get("api_key"))

    return result


def generate(model, signature, key) -> str:
    prompt = generate_code_prompt(model, signature)

    result = inference.generate(model, prompt, {"key": key})

    return result
