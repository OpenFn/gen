import logging
from util import DictObj

from signature_generator import signature_generator as sig_gen
from code_generator import code_generator as code_gen
from util import createLogger

logger = createLogger("adaptor_gen")


class Payload(DictObj):
    api_key: str
    open_api_spec: DictObj
    endpoint: str


def main(dataDict):
    data = Payload(dataDict)

    result = {"files": {}}

    logger.info("Generating adaptor template for {}".format(data.endpoint))

    # TODO the signature should probably handle this
    prompt = "Create an OpenFn function that accesses the /{} endpoint".format(data.endpoint)

    logger.info("prompt: " + prompt)

    # TODO actually there's no point in returning the d.ts right? It's academic at this point
    sig = sig_gen.generate(data.model, dataDict["open_api_spec"], prompt, data.get("api_key"))
    result["files"]["Adaptor.d.ts"] = sig

    code = code_gen.generate(data.model, sig, data.get("api_key"))
    result["files"]["Adaptor.js"] = code

    return result
