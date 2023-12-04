import copy


def generate_prompt(prompt_name: str, signature: str, **kwargs) -> str:
    prompt_template = prompts.get(prompt_name)
    if prompt_template is None:
        raise ValueError(f"Prompt '{prompt_name}' not found.")
    prompt = copy.deepcopy(prompt_template)
    if prompt_name == "code":
        prompt[1]["content"] = prompt[1]["content"].format(signature=signature)
    else:
        prompt = prompt.format(signature=signature)
    return prompt


prompts = {
    "code": [
        {
            "role": "system",
            "content": """
Generate JavaScript implementation for the function signature below. The comments above the function signature describe what it does.
Guides:
- baseUrl in state.configuration, always prepend to endpoint
- Create a new state via spread syntax: `const newState = { ...state, data: data }`.
- Ensure you import and use http from @openfn/language-common for HTTP requests (assume available).
- Copy the comments (see /**/) and include right above function definition.
- Start with any imports.
- Code should contain only JS, functions, and imports. No type definition.""",
        },
        {"role": "user", "content": "\n\nSignature:\n{signature}\nCode:\n ===="},
    ],
    "code_text": """
Generate JavaScript implementation for the function signature below. The comments above the function signature describe what it does.
Guides:
- Use async/await instead of promise chains.
- Create a new state via spread syntax: `const newState = {{ ...state, data: data }}`.
- Ensure you import and use http from @openfn/language-common for HTTP requests (assume available).
- Copy the comments (see /**/) and include right above function definition.
- Start with any imports.
- Code should contain only JS, functions, and imports. No type definition. \n\nSignature:\n{signature}\nCode:\n ====""",
    "llama2": """
Generate JavaScript implementation for the OpenFn function signature below. The comments above the function signature describe what it does.
Guides:
- Use async/await instead of promise chains.
- Create a new state via spread syntax: `const newState = {{ ...state, data: data }}`.
- Ensure you import and use http from @openfn/language-common for HTTP requests (assume available).
- Copy the comments (see /**/) and include right above function definition.
- Start with any imports.
- Code should contain only JS, functions, and imports. No type definition.

### Signature:
{signature}

### Implementation:""",
}
