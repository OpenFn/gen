import sys
import json
from dotenv import load_dotenv

# This will load from the ../.env file (at root)
load_dotenv()


# This module is a sort of "router"
# Given a module name (ie, inference)
# it will import it dynamically and invoke the main
# function with the second argument
# args is a list of the form (serviceName, args)
def main(args):
    service = args[0]
    json = args[1]

    module_name = "{0}.{0}".format(service)
    m = __import__(module_name, fromlist=["main"])
    return m.main(json)


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
