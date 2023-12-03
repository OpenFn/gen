prompts = {
    "signature": [
        {
            "role": "system",
            "content": """
/*Write an Output Signature (function and type) based on OpenAPI Spec and Instruction. Type State is configurable, has at least a configuration and a data object. Configuration contains url, among other parameters. Below is an example*/
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
* @parameter callback {Function} - a callback which is invoked with the resulting state at the end of this operation. Allows users to customise the resulting state. State.data includes the response from Cat
* @returns A function that updates the state with the retrieved cat fact.
*/
declare function getCatFact(callback: (fn: (inState: State) => State)): (outState: State) => State;
type CatFact = { fact: string; length: number; };
type C = {baseUrl : string;}
type State<C = {}, D = {}> = { configuration: C; data: CatFact;};
===""",
        },
        {
            "role": "user",
            "content": "\n\nOpenAPI Spec:\n{spec}\n\nInstruction:\n{instruction}\n\nOutput Signature:",
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
    "api_spec": """/*Extract an endpoint path, request type and its corresponding parameters and response details from OpenAPI spec. Find these based on the given Instruction*/
    OpenAPI Spec:
    {{
    "openapi": "3.0.0",
    "info": {{
        "title": "Random Cat Fact API",
        "version": "1.0.0",
        "description": "API for retrieving random facts about cats."
    }},
    "paths": {{
        "/fact": {{
        "get": {{
            "summary": "Get a random cat fact",
            "responses": {{
            "200": {{
                "description": "Successful response",
                "content": {{
                "application/json": {{
                    "schema": {{
                    "$ref": "#/components/schemas/CatFact"
                    }}
                }}
                }}
            }}
            }}
        }}
        }}
    }},
    "components": {{
        "schemas": {{
        "CatFact": {{
            "type": "object",
            "properties": {{
            "fact": {{
                "type": "string"
            }},
            "length": {{
                "type": "number"
            }}
            }}
        }}
        }}
    }}
    }}

    Instruction:
    Get any fact on cats.

    Output:
    OpenAPI Spec:
    GET /fact
    Parameters:
    - max_length: integer
    Response 200:
    - CatFact:
    fact: string
    length: integer


    ===

    Input:
    OpenAPI Spec:
    {full_spec}

    Instruction:
    {instruction}

    Output:
    """,
}


def generate_prompt(prompt_name: str, **kwargs) -> str:
    prompt_template = prompts.get(prompt_name)
    if prompt_template is None:
        raise ValueError(f"Prompt '{prompt_name}' not found.")
    print("\nbef kwargs")
    for k, v in kwargs.items():
        print("\n", k)
        print(v)
    encoded_kwargs = {
        k: v.replace("{", "{{").replace("}", "}}") for k, v in kwargs.items()
    }
    print("\nafter encode kwargs")
    for k, v in encoded_kwargs.items():
        print("\n", k)
        print(v)
    if prompt_name == "signature":
        prompt_template[1]["content"] = prompt_template[1]["content"].format(**kwargs)
        print("\nbef sig prompt")
        print(prompt_template[1]["content"])
        prompt_template[1]["content"] = (
            prompt_template[1]["content"].replace("}}", "}").replace("{{", "{")
        )
        print("\nafter sig prompt")
        print(prompt_template[1]["content"])
    else:
        prompt_template = prompt_template.format(**encoded_kwargs)
        print("\nbef sig line")
        print(prompt_template)
        prompt_template = prompt_template.replace("}}", "}").replace("{{", "{")
        print("\nafter sig line")
        print(prompt_template)
    return prompt_template
