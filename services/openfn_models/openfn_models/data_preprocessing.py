# from datasets import load_dataset

# train_dataset = load_dataset("json", data_files="data/alpaca_data.json")
# print(train_dataset)
# # eval_dataset = load_dataset('json', data_files='notes_validation.jsonl', split='train')
import requests
import json
import os
import re
from utils.utils import split_json_dataset
from utils.prompts import implementation_template

root_directory = "/Users/isma/Documents/OpenFN/onboarding/adaptors/packages"
OUTPUT_PATH = "data/adaptors/adaptor_functions.json"
DATASET_INSTR = "data/adaptors/adaptor_functions_instr.json"
DATASET_PROMPT = "data/adaptors/adaptor_functions_prompt_play.json"


def read_adaptor_files(root_directory):
    adaptor_files = {"js": [], "d.ts": []}

    packages = [
        d
        for d in os.listdir(root_directory)
        if os.path.isdir(os.path.join(root_directory, d))
    ]

    for package in packages:
        js_path = os.path.join(root_directory, package, "src", "Adaptor.js")
        dts_path = os.path.join(root_directory, package, "types", "Adaptor.d.ts")
        if os.path.exists(js_path):
            adaptor_files["js"].append(js_path)

        if os.path.exists(dts_path):
            adaptor_files["d.ts"].append(dts_path)
    return adaptor_files


def read_file(file_path):
    with open(file_path, "r") as file:
        return file.read()


def read_json(file_path):
    with open(file_path, "r") as file:
        return json.load(file)


def extract_tests(test_content):
    tests = []

    # Regular expression to find describe blocks
    describe_regex = re.compile(
        r'describe\s*\(\s*[\'"]([^\'"]+)[\'"]\s*,\s*\(\s*\)\s*=>\s*{([\s\S]*?)\s*}\s*\)\s*;?',
        re.MULTILINE,
    )

    describe_matches = describe_regex.finditer(test_content)

    for describe_match in describe_matches:
        describe_name = describe_match.group(1).strip()
        describe_body = describe_match.group(0).strip()

        tests.append({"name": describe_name, "test": describe_body})

    return tests


def merge_signatures_with_implementations(signatures, implementations, tests=None):
    merged_function = []

    # Create a dictionary for quick lookups based on the 'name' key
    implementation_dict = {item["name"]: item for item in implementations}
    for signature in signatures:
        name = signature["name"]
        if name in implementation_dict:
            signature["implementation"] = implementation_dict[name]["code"]
            signature["signature"] = signature.pop("code")
            if tests:
                matching_tests = [test for test in tests if test["name"] == name]
                if matching_tests:
                    test = matching_tests[0]
                    signature["test"] = test["test"]
                    print(test["name"])
            else:
                signature["test"] = ""
            merged_function.append(signature)

    return merged_function


def get_openfn_imports(js_content):
    import_regex = re.compile(
        r'^\s*import\s+(.*?)\s+from\s+["\']@openfn\/([^ "\']+)["\']\s*;',
        re.MULTILINE | re.DOTALL,
    )
    exclude_pattern = re.compile(r"\/\*\*", re.MULTILINE | re.DOTALL)
    import_matches = []

    for match in import_regex.finditer(js_content):
        import_statement = match.group(0)
        if "@openfn/" in import_statement and not exclude_pattern.search(
            import_statement
        ):
            import_matches.append(import_statement)

    # Return the list of imported statements
    return list(set(import_matches))


def extract_functions_with_regex(file_content, imports=True):
    functions = []
    openfn_imports = []
    if imports:
        openfn_imports = get_openfn_imports(file_content)

    pattern = re.compile(
        r"\/\*\*([\s\S]*?)\*\/\s*(?:export\s+)function\s+(\w+)\s*\(([\s\S]*?)(?=(export|function|\/\*\*))"
    )
    matches = pattern.finditer(file_content)

    for match in matches:
        code = match.group(0).strip()
        function_name = match.group(2)

        import_string = "\n".join(openfn_imports)
        functions.append(
            {
                "name": function_name,
                "code": f"{import_string}\n{code}" if imports else f"{code}",
            }
        )

    return functions


def save_as_json(data, filename):
    with open(filename, "w") as json_file:
        json.dump(data, json_file, indent=2)


# merging dataset across adaptors
def merge_lists(lists):
    merged_list = []
    for my_list in lists:
        merged_list.extend(my_list)
    return merged_list


def extract_adaptor_dataset(
    packages,
    output_path=OUTPUT_PATH,
):
    files = read_adaptor_files(packages)

    js_files = files["js"]
    dts_files = files["d.ts"]
    dataset = []
    num = 0

    for js_file, dts_file in zip(js_files, dts_files):
        # js_file = "/Users/isma/Documents/OpenFN/onboarding/adaptors/packages/twilio/src/Adaptor.js"
        # dts_file = "/Users/isma/Documents/OpenFN/onboarding/adaptors/packages/twilio/types/Adaptor.d.ts"
        js_content = read_file(js_file)
        dts_content = read_file(dts_file)

        implementations = extract_functions_with_regex(js_content)
        signatures = extract_functions_with_regex(dts_content, imports=False)
        num = num + len(implementations)
        tests = None
        test_file = js_file.replace("/src/Adaptor.js", "/test/Adaptor.test.js")
        exist = os.path.exists(test_file)
        if os.path.exists(test_file):
            test_content = read_file(test_file)
            tests = extract_tests(test_content)
            print("\n", test_file)
        print()
        exit()
        adaptor_functions = merge_signatures_with_implementations(
            signatures, implementations, tests
        )
        dataset.extend(adaptor_functions)
    save_as_json(dataset, output_path)
    print("LENGTH \n\n", len(dataset))
    print("Len Imp", num)
    return dataset


def generate_instructions(implementations: list[str]):
    instr_template = """
Given the JSDoc comment below, extract the instruction line. Return an instruction sentence of format "create an OpenFn function that <action> to/on/from <target>".

{signature}
==========="""
    # Chunk the implementations into groups of 5
    chunk_size = 20
    implementation_chunks = [
        implementations[i : i + min(chunk_size, len(implementations) - i)]
        for i in range(0, len(implementations), chunk_size)
    ]
    print(implementations[31])
    # exit()

    endpoint_url = "http://localhost:8002/gpt3/generate_instruction/"
    # print(implementation_chunks[0][0]["signature"])
    chunk_index = 0
    for chunk in implementation_chunks:
        prompts = [instr_template.format(signature=impl["signature"]) for impl in chunk]

        response = requests.post(endpoint_url, json=prompts)
        instructions = response.json()["instructions"]
        print(instructions)
        for i, instruction in enumerate(instructions):
            print(f"Generated instruction for Implementation {i + 1}:{instruction}\n")
            print(f"Instr for {i + chunk_index} / {len(implementations)}\n")
            print(f"sig {implementations[i + chunk_index]['signature']}\n")
            implementations[i + chunk_index]["instruction"] = instruction.replace(
                "\n", ""
            )
        chunk_index = chunk_index + chunk_size
    save_as_json(implementations, "data/adaptors/adaptor_functions_instr.json")
    return implementations


def build_code_prompt(instruction, signature, implementation):
    return implementation_template.format(
        instruction=instruction, signature=signature, implementation=implementation
    )


def build_prompts(dataset):
    dataset_with_prompts = []
    for data in dataset:
        prompt = build_code_prompt(
            data["instruction"], data["signature"], data["implementation"]
        )
        data["prompt"] = prompt
        print(prompt, "\n")
        dataset_with_prompts.append(data)
    save_as_json(dataset_with_prompts, DATASET_PROMPT)
    return dataset_with_prompts


# adaptor_functions = extract_adaptor_dataset(root_directory)

data = read_json("data/adaptors/adaptor_functions_prompts.json")
print(len(data))
train_json, test_json = split_json_dataset(data, 0.1)
print(len(train_json))
print(len(test_json))
save_as_json(train_json, "data/processed_data/train.json")
save_as_json(test_json, "data/processed_data/test.json")
# print(type(data))
# print(data[1]["signature"])
# generate_instructions(data)
# build_prompts(data)
