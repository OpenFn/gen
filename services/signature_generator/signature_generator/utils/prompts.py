prompts = {
    "greeting": "Hello, my name is {name}. I am {age} years old and I live in {location}.",
    "signature": """/*Write an Output Signature (function and type) based on OpenAPI Spec and Instruction. Type State has a configuration and a data object.*/
    OpenAPI Spec:
    GET /fact
    Response 200:
    - CatFact:
      fact: string
      length: number

    Instruction:
    Get a random cat fact.

    Output Signature:
    /**
    * Retrieves a random cat fact and includes it in the state data.
    * Sends a GET request to the /fact endpoint of Cat.
    * @parameter callback {{Function}} - a callback which is invoked with the resulting state at the end of this operation. Allows users to customise the resulting state. State.data includes the response from Cat
    * @returns A function that updates the state with the retrieved cat fact.
    */
    declare function GetRandomCatFact(callback: (fn: (inState: State) => State)): (outState: State) => State;
    type CatFact = {{ fact: string; length: number; }};

    type State<C = {{}}, D = {{}}> = {{ configuration: C; data: CatFact;}};

    ===

    OpenAPI Spec:
    {spec}

    Instruction:
    {instruction}

    Output Signature:

    """,
    "signature_default": """/*Write an Output Signature (function and type) based on OpenAPI Spec and Instruction. Type State has a configuration and an optional object.*/
    OpenAPI Spec:
    GET /fact
    Response 200:
    - CatFact:
      fact: string
      length: number

    Instruction:
    Get a random cat fact.

    Output Signature:
    declare function GetRandomCatFact(callback: (fn: (state: State) => State)): (state: State) => State;
    type CatFact = {{ fact: string; length: number; }};
    type State = {{ configuration: {{ [key: string]: any }}; catFact?: CatFact;}};

    ===

    OpenAPI Spec:{spec}

    Instruction:{instruction}

    Output Signature:

    """,
    "api_spec": """
    OpenAPI Spec:
    {
    "openapi": "3.0.0",
    "info": {
        "title": "Random Cat Fact API",
        "version": "1.0.0",
        "description": "API for retrieving random facts about cats."
    },
    "paths": {
        "/fact": {
        "get": {
            "summary": "Get a random cat fact",
            "responses": {
            "200": {
                "description": "Successful response",
                "content": {
                "application/json": {
                    "schema": {
                    "$ref": "#/components/schemas/CatFact"
                    }
                }
                }
            }
            }
        }
        }
    },
    "components": {
        "schemas": {
        "CatFact": {
            "type": "object",
            "properties": {
            "fact": {
                "type": "string"
            },
            "length": {
                "type": "number"
            }
            }
        }
        }
    }
    }

    Output:
    OpenAPI Spec:
    GET /fact
    Response 200:
    - CatFact:
        fact: string
        length: number


    ===

    Input:
    OpenAPI Spec:
    {full_spec}

    Output:
    """,
    # Add more prompts here
}


def generate_prompt(prompt_name: str, **kwargs) -> str:
    prompt_template = prompts.get(prompt_name)
    if prompt_template is None:
        raise ValueError(f"Prompt '{prompt_name}' not found.")
    encoded_kwargs = {k: v.replace("\\n", "\n") for k, v in kwargs.items()}
    return prompt_template.format(**encoded_kwargs)
