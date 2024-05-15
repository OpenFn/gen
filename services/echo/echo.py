# relative imports work well!
from .log import log

from util import createLogger


# Simple python service to echo requests back to the caller
# Used in test
def main(x):
    logger = createLogger("echo")
    log(x)
    return x
