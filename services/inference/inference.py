import logging

from .models.gpt3_turbo import generate as gpt3_turbo
from .models.codet5 import generate as codet5
from .models.gpt_ft import generate as gpt_ft

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Thanks Joel! https://joelmccune.com/python-dictionary-as-object/
class DictObj:
    def __init__(self, in_dict: dict):
        self._dict = in_dict
        assert isinstance(in_dict, dict)
        for key, val in in_dict.items():
            if isinstance(val, (list, tuple)):
                setattr(self, key, [DictObj(x) if isinstance(x, dict) else x for x in val])
            else:
                setattr(self, key, DictObj(val) if isinstance(val, dict) else val)

    def get(self, key):
        if key in self._dict:
            return self._dict[key]
        return None


# all http calls to inference need a model and prompt, and optionally an args dict
class Payload:
    def __init__(self, dict):
        self.model = dict["model"]
        self.prompt = dict["prompt"]
        self.args = DictObj(dict.get("args", {}))


# This is interface for calls from js-land (via http)
def main(dataDict):
    data = Payload(dataDict)

    result = generate(data.model, data.prompt, data.args)

    logger.info(result)

    return result


# This is an internal entrypoint, used by other modules
def generate(model, prompt, args):
    result = ""

    if model == "gpt3_turbo":
        prompt = [{"role": "user", "content": prompt}]
        result = gpt3_turbo(prompt, args.get("key"))

    # This is likely to be unstable
    if model == "gpt3_ft":
        prompt = [{"role": "user", "content": prompt}]
        result = gpt_ft(prompt, args.get("key"))

    if model == "codet5":
        result = codet5(prompt)

    # TODO llama2 is broken

    return result
