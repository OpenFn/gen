import logging
import sys


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


filename = None

loggers = {}


def setLogOutput(f):
    global filename

    if f is not None:
        print("[entry.py] writing logs to {}".format(f))

    filename = f


def createLogger(name):
    print("CREATE LOGGER  {}".format(name))

    # hmm. If I use a stream other than stdout,
    # I could send logger statements elsewhere
    # but I wouldn't be able to read it from the outside
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    if not name in loggers:
        logger = logging.getLogger(name)

        loggers[name] = logger
    else:
        print("RETURNING CACHED LOGGER")

    return loggers[name]
