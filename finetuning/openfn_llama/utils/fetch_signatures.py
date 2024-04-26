import os
import re


def generate_type_definitions(file_path, output_path):
    # Regular expression to capture TypeScript function declarations with JSDoc comments
    ts_function_pattern = re.compile(
        r"(/\*\*[\s\S]+?\*/)\s+"  # Match a JSDoc comment block preceding a function
        r"export function (\w+)\(([\s\S]+?)\):\s*(.*?);",  # Match the function signature
    )

    # Ensure output_path exists
    os.makedirs(output_path, exist_ok=True)

    # Read the content of the file
    with open(file_path, "r", encoding="utf-8") as file:
        file_content = file.read()

    # Extract all functions along with their comments
    matches = ts_function_pattern.findall(file_content)

    # Loop through matches to create .d.ts files
    for match in matches:
        jsdoc, function_name, params, return_type = match
        # Construct the type definition content
        ts_definition = (
            f"{jsdoc}\n"  # Add the JSDoc comment
            f"export function {function_name}({params}): {return_type};\n"
        )
        # Write the type definition to a corresponding '.d.ts' file
        with open(
            os.path.join(output_path, f"{function_name}.d.ts"), "w", encoding="utf-8"
        ) as dts_file:
            dts_file.write(ts_definition)


adaptor = "godata"
signature_path = f"/Users/isma/Documents/OpenFN/onboarding/adaptors/packages/{adaptor}/types/Adaptor.d.ts"
output_path = f"/Users/isma/Documents/OpenFN/dev/llama/gen/services/openfn_llama/datasets/rest_adaptors/{adaptor}/signatures"
generate_type_definitions(signature_path, output_path)
