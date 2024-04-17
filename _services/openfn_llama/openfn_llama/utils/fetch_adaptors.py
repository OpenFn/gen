import os
import re


def extract_all_imports(file_content):
    imports = re.findall(
        r'import\s+[\s\S]+?\s+from\s+["\'][\s\S]+?["\'];', file_content, re.MULTILINE
    )
    return "\n".join(imports)


def extract_functions_with_jsdoc(file_content):
    function_pattern = re.compile(
        # Match the JSDoc comment block, if it exists
        r"(/\*\*[\s\S]+?\*/\s*)?"
        # Match the optional `export` keyword, the `function` keyword, and the function name
        r"(export\s+)?function\s+(\w+)\s*"
        # Match the function parameters and body
        r"(\([\s\S]+?\)\s*\{[\s\S]+?\})\s*?(?=\/\*\*|export|function)",
        re.MULTILINE,
    )
    return function_pattern.findall(file_content)


def generate_function_files_with_all_imports(js_file_path, output_path):
    with open(js_file_path, "r", encoding="utf-8") as file:
        file_content = file.read()

    all_imports = extract_all_imports(file_content)
    function_blocks = extract_functions_with_jsdoc(file_content)

    if not os.path.exists(output_path):
        os.makedirs(output_path)

    for jsdoc, export, function_name, function_body in function_blocks:
        if export:
            export = export.strip()
        function_declaration = (
            f"export function {function_name}"
            if export
            else f"function {function_name}"
        )
        function_content = f"{jsdoc}{function_declaration}{function_body}"

        output_file_path = os.path.join(output_path, f"{function_name}.js")
        with open(output_file_path, "w", encoding="utf-8") as out_file:
            out_file_content = f"{all_imports}\n\n{function_content}"
            out_file.write(out_file_content.strip())


adaptor = "godata"
adaptor_path = f"/Users/isma/Documents/OpenFN/onboarding/adaptors/packages/{adaptor}/src/Adaptor.js"
output_path = f"/Users/isma/Documents/OpenFN/dev/llama/gen/services/openfn_llama/datasets/rest_adaptors/{adaptor}/adaptors"
output_path = "./temp"
generate_function_files_with_all_imports(adaptor_path, output_path)
