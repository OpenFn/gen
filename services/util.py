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


def setLogOutput(f):
    global filename

    filename = f


# get a logger which writes to a file
# but also to stdout please!
# I suppose it depends on the entry, someone needs to pass a flag
# to setup the file
def createLogger(name):
    # create a logger which writes to disk
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(name)

    # logger.addHandler(logging.StreamHandler(sys.stdout))
    # this doesn't log with the file names etc
    # but that's probably good, because the CLI doesn't need to know that stuff
    # TODO only do this on first creation
    logger.addHandler(logging.FileHandler(filename))
    return logger
