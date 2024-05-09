from util import createLogger

logger = createLogger("echo2")


def log(x):
    logger.info("Echoing request")
    logger.info(x)
