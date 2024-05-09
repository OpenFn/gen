from util import createLogger

logger = createLogger("slow")


# Simple python service to echo requests back to the caller
# Used in test
def main(x):
    for i in range(0):
        logger.info("...{}".format(i))
        sleep(200)
