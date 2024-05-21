from util import createLogger

logger = createLogger("echo")


def log(x):
    logger.info("Echoing request")
    logger.info(x)
