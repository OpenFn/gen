prompts = {
    "greeting": "Hello, my name is {name}. I am {age} years old and I live in {location}.",
    "signature": """OpenAPI Spec:
    GET /fact
    Response 200:
    - CatFact:
      fact: string
      length: number

    Instruction:
    Get a random cat fact.

    Sample Output:
    declare function GetRandomCatFact(callback: (fn: (state: State) => State)): (state: State) => State;
    type CatFact = {{ fact: string; length: number; }};

    OpenAPI Spec:{spec}

    Instruction:{instruction}

    Sample Output:""",
    # Add more prompts here
}


def generate_prompt(prompt_name: str, **kwargs) -> str:
    prompt_template = prompts.get(prompt_name)
    if prompt_template is None:
        raise ValueError(f"Prompt '{prompt_name}' not found.")
    encoded_kwargs = {k: v.replace("\\n", "\n") for k, v in kwargs.items()}
    return prompt_template.format(**encoded_kwargs)
