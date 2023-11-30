def generate_prompt(prompt_name: str, signature: str, **kwargs) -> str:
    prompt_template = prompts.get(prompt_name)
    if prompt_template is None:
        raise ValueError(f"Prompt '{prompt_name}' not found.")
    encoded_kwargs = {k: v.replace("\\n", "\n") for k, v in kwargs.items()}
    if prompt_name == "code":
        formatted_template = prompt_template[1]["content"].format(signature=signature)
    else:
        formatted_template = prompt_template.format(
            signature=signature, **encoded_kwargs
        )
    return formatted_template


prompts = {
    "code": [
        {
            "role": "system",
            "content": """
Generate JavaScript implementation for the function signature below. The comments above the function signature describe what it does.
Guides:
- Use async/await instead of promise chains.
- Create a new state via spread syntax: `const newState = {{ ...state, data: data }}`.
- Ensure you import and use http from @openfn/language-common for HTTP requests (assume available).
- Copy the comments (see /**/) and include right above function definition.
- Start with any imports.
- Code should contain only JS, functions, and imports. No type definition.""",
        },
        {"role": "user", "content": "\n\nSignature:\n{signature}\nCode:\n ===="},
    ],
    "code_text_original": "Generate a TypeScript implementation for the function in the signature below. The comments above the function describe what it does\n\n ==== \n\nSignature:\n{signature}\nCode:\n ====",
    "code_text": """
Generate JavaScript implementation for the function signature below. The comments above the function signature describe what it does.
Guides:
- Use async/await instead of promise chains.
- Create a new state via spread syntax: `const newState = {{ ...state, data: data }}`.
- Ensure you import and use http from @openfn/language-common for HTTP requests (assume available).
- Copy the comments (see /**/) and include right above function definition.
- Start with any imports.
- Code should contain only JS, functions, and imports. No type definition. \n\nSignature:\n{signature}\nCode:\n ====""",
}
