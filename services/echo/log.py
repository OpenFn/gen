from util import createLogger

# TODO - in long running python, this needs to be re-intialised every time
logger = createLogger("echo2")


def log(x):
    logger.info("Echoing request")
    logger.info(x)
