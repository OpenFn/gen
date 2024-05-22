from util import DictObj, createLogger

from .utils import (
    generate_code_prompt,
)

from inference import inference


logger = createLogger("code_generator")


class Payload(DictObj):
    api_key: str
    signature: str
    model: str


# generate adaptor code based on a model and signature
def main(dataDict) -> str:
    data = Payload(dataDict)
    logger.generate("Running code generator with model {}".format(data.model))
    result = generate(data.model, data.signature, data.get("api_key"))
    logger.generate("Code generation complete!")
    return result


def generate(model, signature, key) -> str:
    prompt = generate_code_prompt(model, signature)

    result = inference.generate(model, prompt, {"key": key})

    return result
