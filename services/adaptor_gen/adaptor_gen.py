import logging
from util import DictObj

from signature_generator import signature_generator as sig_gen
from code_generator import code_generator as code_gen

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Payload(DictObj):
    api_key: str
    open_api_spec: DictObj
    endpoint: str


def main(dataDict):
    data = Payload(dataDict)

    result = {}

    logger.info("Generating adaptor template for {}".format(data.endpoint))

    # TODO the signature should probably handle this
    prompt = "Create an OpenFn function that accesses the /{} endpoint".format(data.endpoint)

    logger.info("prompt: " + prompt)

    sig = sig_gen.generate(data.model, dataDict["open_api_spec"], prompt, data.get("api_key"))
    result["Adaptor.d.ts"] = sig

    code = code_gen.generate(data.model, sig, data.get("api_key"))
    result["Adaptor.js"] = code

    return result
