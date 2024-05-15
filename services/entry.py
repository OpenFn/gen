import sys
import json
from dotenv import load_dotenv
import logging
from util import setLogOutput

# from contextlib import redirect_stdout

# This will load from the ../.env file (at root)
load_dotenv()


# with open("out.txt", "w") as f:
#     with redirect_stdout(f):
#         print("it now prints to `out.text`")
# overwrite stdout and redirect to disk
# with open('file', 'w') as sys.stdout:
#     print('test')


# This module is a sort of "router"
# Given a module name (ie, inference)
# it will import it dynamically and invoke the main
# function with the second argument
# args is a list of the form (serviceName, args)
def main(args):
    service = args[0]
    json = args[1]
    logfile = args[2]
    delimiter = args[3]

    # always set the logfile (even and indeed especially if it is none)
    setLogOutput(logfile)

    # create a special logger to flag when we're done
    # We don't want to see this in stdout
    if logfile is not None:
        # set all logging to write to this file
        # if another module is called while this is running, they'll interfere

        logger = logging.getLogger("apollo")
        logger.addHandler(logging.FileHandler(logfile))

    module_name = "{0}.{0}".format(service)
    m = __import__(module_name, fromlist=["main"])
    result = m.main(json)

    # Write the end message to the log
    if logfile is not None:
        f = open(logfile, "a")
        f.write("{}\n".format(delimiter))
        f.close()

    return result


# when called from main, look for
# a) a service name
# b) a path to input
# Then call the module via main()
if __name__ == "__main__":
    mod_name = sys.argv[1]
    data = None

    print("Calling services/{} ...".format(mod_name))

    if len(sys.argv) >= 2:
        json_path = sys.argv[2]
        data = json.load(open(json_path))
        print(" loaded input JSON OK!")

    print()
    result = main([mod_name, data])
    print()
    print("Done!")
    print(result)
