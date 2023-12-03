def generate_prompt(prompt_name: str, signature: str, **kwargs) -> str:
    prompt_template = prompts.get(prompt_name)
    if prompt_template is None:
        raise ValueError(f"Prompt '{prompt_name}' not found.")
    print("\nbef sig")
    print(signature)
    # signature = signature.replace("}", "}}").replace("{", "{{")
    print("\nafter sig")
    print(signature)
    if prompt_name == "code":
        print("signature")
        print(signature)
        print(prompt_template[0]["role"])
        print(prompt_template[0]["content"])
        print(prompt_template[1]["role"])
        print(prompt_template[1]["content"])
        prompt_template[1]["content"] = prompt_template[1]["content"].format(
            signature=signature
        )
        prompt_template[1]["content"] = (
            prompt_template[1]["content"].replace("}}", "}").replace("{{", "{")
        )
    else:
        prompt_template = prompt_template.format(signature=signature)
        prompt_template = prompt_template.replace("}}", "}").replace("{{", "{")
    return prompt_template


prompts = {
    "code": [
        {
            "role": "system",
            "content": """
Generate JavaScript implementation for the function signature below. The comments above the function signature describe what it does.
Guides:
- Use async/await instead of promise chains.
- Create a new state via spread syntax: `const newState = { ...state, data: data }`.
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
