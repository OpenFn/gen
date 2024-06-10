from util import createLogger, apollo

logger = createLogger("job_chat.prompt")

# RAG
# Retrieval Augmented Generation
system_message = """
you are an agent helping a non-export user write a job for OpenFn,
the worlds leading digital public good for workflow automation.
You are helping the user write a job in openfn's custom dsl, which
is very similar to JAVASCRIPT. you should STRICTLY ONLY answer
questions related to openfn, javascript programming, and workflow automation.
"""

# for now we're hard coding a sort of job writing 101 with code examples
# Later we'll do some real RAG against the docsite
job_writing_summary = """
Here is a guide to job writing in OpenFn.

A Job is a bunch of openfn dsl code which performs a particular task, like
fetching data from Salesforce or converting JSON data to FHIR standard.

Each job uses exactly one Adaptor to perform its task. The Adaptor provides a
collection of Operations (helper functions) which makes it easy to communicate with
a data source. The adaptor API for this job is provided below.

An Operation is a factory function returns a function that takes state and returns state. A
In other words:
```
const myOperation = (arg) => (state) => { /* do something with arg and state */ return state; }
```

The job code will be compiled into an array operation factories, which at runtime will be 
executed in series, with state passed into each one.

For example, here's how we issue a GET request with the http adaptor:
```
get('/patients');
```
The first argument to get is the path to request from (the configuration will tell
the adaptor what base url to use). In this case we're passing a static string,
but we can also pass a value from state:
```
get(state => state.endpoint);
```
This works because each operation's arguments allow a function to be passed,
which will be lazily invoked at runtime with the latest state value.

Job code should only contain Operations at the top level/scope - you MUST NOT
include any other JavaScript statements at the top level.

Job code is written in modern JavaScript, and although async/await is allowed
inside a callback function (never at the top level), it is rarely used.

Example job code with the HTTP adaptor:
```
get('/patients');
each('$.data.patients[*]', (item, index) => {
  item.id = `item-${index}`;
});
post('/patients', dataValue('patients'));
```
Example job code with the Salesforce adaptor:
```
each(
  '$.form.participants[*]',
  upsert('Person__c', 'Participant_PID__c', state => ({
    Participant_PID__c: state.pid,
    First_Name__c: state.participant_first_name,
    Surname__c: state.participant_surname,
  }))
);
```
Example job code with the ODK adaptor:
```
each(
  '$.data.data[*]',
  create(
    'ODK_Submission__c',
    fields(
      field('Site_School_ID_Number__c', dataValue('school')),
      field('Date_Completed__c', dataValue('date')),
      field('comments__c', dataValue('comments')),
      field('ODK_Key__c', dataValue('*meta-instance-id*'))
    )
  )
);
```
-----
"""


def build_context(context):
    message = [job_writing_summary]

    if context.has("adaptor"):
        message.append("I am using the OpenFn {} adaptor, use functions provided by its API".format(context.adaptor))

        # TODO we should surely import the API here or something?
        adaptor_docs = apollo("describe_adaptor", {"adaptor": context.adaptor})
        for doc in adaptor_docs:
            message.append("Typescript definitions for doc")
            message.append(adaptor_docs[doc]["description"])
        message.append("-------------------------")

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

    # # push the system message
    prompt.append({"role": "system", "content": system_message})

    # # push the history
    prompt.extend(history)

    # add context as a seperate message here
    # idk if this will work
    prompt.append(build_context(context))

    # Finally, append the latest message from the user
    prompt.append({"role": "user", "content": content})

    return prompt
