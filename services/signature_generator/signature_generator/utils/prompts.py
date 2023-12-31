import copy

prompts = {
    "signature": [
        {"role": "system", "content": "You are a JS coding assistant"},
        {
            "role": "user",
            "content": """
/*Write an Output Signature (JSDoc and function) based on OpenAPI Spec and Instruction. State is configurable, has at least a configuration and a data object. Configuration contains url, among other parameters. Below is an example*/
### Example OpenAPI Spec:
OpenAPI Spec:
GET /fact
Parameters:
- max_length: integer
Response 200:
- CatFact:
    fact: string
    length: integer

### Example Instruction:
Create an OpenFn function that reads from the /fact endpoint

### Example Output Signature:
/**
  * Retrieves a fact on cats and includes it in the state data.
  * Sends a GET request to the /fact endpoint of Cat.
  * @example
  * getCatFact(123, callback)
  * @function
  * @param {{number}} max_length - Max number of facts to retrieve
  * @param {{Function}} callback - A callback which is invoked with the resulting state at the end of this operation. Allows users to customize the resulting state. State.data includes the response from Cat.
  * @example <caption>Get a patient by uuid</caption>
  * getCatFact(10)
  * @returns {{Function}} A function that updates the state with the retrieved cat fact.
  */
  export function getCatFact(max_length?:number, callback?: Function): Operation;

===

### OpenAPI Spec:
{spec}

### Instruction:
{instruction}

### Output Signature:
======
""",
        },
    ],
    "signature_text": """/*Write an Output Signature (function and type) based on OpenAPI Spec and Instruction. Type State is configurable, has at least a configuration and a data object. Configuration contains url, among other parameters*/
    OpenAPI Spec:
    GET /fact
    Parameters:
    - max_length: integer
    Response 200:
    - CatFact:
        fact: string
        length: integer

    Instruction:
    Create an OpenFn function that reads from the /fact endpoint

    Output Signature:
    /**
    * Retrieves a fact on cats and includes it in the state data.
    * Sends a GET request to the /fact endpoint of Cat.
    * @parameter callback {{Function}} - a callback which is invoked with the resulting state at the end of this operation. Allows users to customise the resulting state. State.data includes the response from Cat
    * @returns A function that updates the state with the retrieved cat fact.
    */
    declare function getCatFact(callback: (fn: (inState: State) => State)): (outState: State) => State;
    type CatFact = {{ fact: string; length: number; }};
    type C = {{baseUrl : string;}}
    type State<C = {{}}, D = {{}}> = {{ configuration: C; data: CatFact;}};
    ===

    OpenAPI Spec:
    {spec}

    Instruction:
    {instruction}

    Output Signature:
    """,
}


def generate_prompt(prompt_name: str, **kwargs) -> str:
    prompt_template = prompts.get(prompt_name)
    if prompt_template is None:
        raise ValueError(f"Prompt '{prompt_name}' not found.")
    prompt = copy.deepcopy(prompt_template)
    if prompt_name == "signature":
        prompt[1]["content"] = prompt[1]["content"].format(**kwargs)
    else:
        prompt = prompt.format(**kwargs)
    return prompt
