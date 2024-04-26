from dotenv import load_dotenv

# TODO I don't know if this works
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
