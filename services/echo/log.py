from util import createLogger

logger = createLogger("echo")


def log(x):
    logger.error("ERROR")
    logger.info("Echoing request")
    logger.info(x)
