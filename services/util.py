import logging
import sys
import requests


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

    def has(self, key):
        return key in self._dict

    def toDict(self):
        return self._dict


filename = None

loggers = {}


def setLogOutput(f):
    global filename

    if f is not None:
        print("[entry.py] writing logs to {}".format(f))

    filename = f


def createLogger(name):
    # hmm. If I use a stream other than stdout,
    # I could send logger statements elsewhere
    # but I wouldn't be able to read it from the outside
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    if not name in loggers:
        logger = logging.getLogger(name)

        loggers[name] = logger

    return loggers[name]


# call out to another apollo service through http
def apollo(name, payload):
    # TODO how do I do this properly?
    # python land doesn't really even know about the server
    # is env.port safe? Well maybe not
    url = "http://localhost:3000/services/{}".format(name)
    r = requests.post(url, payload)
    return r.json()
