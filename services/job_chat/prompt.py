from util import DictObj, createLogger

logger = createLogger("job_chat.prompt")

system_message = """
you are an agent helping a non-export user write a job for OpenFn,
the worlds leading digital public good for workflow automation.
You are helping the user write a job in openfn's custom dsl, which
is very similar to JAVASCRIPT. you should STRICTLY ONLY answer
questions related to openfn, javascript programming, and workflow automation.
"""


def build_context(context):
    message = []

    if context.has("adaptor"):
        message.append("I am using the OpenFn {} adaptor, use functions provided by its API".format(context.adaptor))

        # TODO we should surely import the API here or something?
    else:
        message.append("I am using an OpenFn Adaptor to write my job.")

    if context.has("expression"):
        message.append(
            "My code currently looks like this :```{}```\n\n You should try and re-use any relevant user code in your response".format(
                context.expression
            )
        )

    if context.has("input"):
        "My input data is :\n\n```{}```".format(context.input)

    if context.has("output"):
        "My last output data was :\n\n```{}```".format(context.output)

    if context.has("log"):
        "My last log output was :\n\n```{}```".format(context.log)

    return {"role": "user", "content": "\n\n".join(message)}


def build_prompt(content, history, context):
    prompt = []

    # push the system message
    prompt.append({"role": "system", "content": system_message})

    # push the histor
    prompt.extend(history)

    # add context as a seperate message here
    # idk if this will work
    prompt.append(build_context(context))

    # Finally, append the latest message from the user
    prompt.append({"role": "user", "content": content})

    return prompt
