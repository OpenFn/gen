import json
import logging
from pathlib import Path

import requests

logger = logging.getLogger(__name__)
end_point_signature = "http://localhost:8003/generate_signature_v2/"
end_point_code = "http://localhost:8004/generate_code/"

samples = ["mailchimp", "cat-facts", "dhis2", "fhir"]
model_names = ["codeT5", "gpt2", "gpt3_turbo", "gpt_ft", "llama2"]

for i in samples:
    base_path = Path(f"../samples/{i}")

    # Opening JSON file
    spec_path = base_path / "spec.json"

    with spec_path.open("r") as file:
        full_spec = json.load(file)

    instruction_path = base_path / "instruction.txt"

    with open(instruction_path) as file2:
        instruction = file2.read()

    data_full = {
        "open_api_spec": full_spec,
        "instruction": instruction,
        "model": "gpt3_turbo",
    }

    # Generate signature
    response = requests.post(end_point_signature, json=data_full)
    signature = response.json()["signature"]

    print(f"\nSignature:\n{signature}")

    dts_path = base_path / "Adaptor.d.ts"
    f = open(dts_path, "w")
    f.write(signature)
    f.close()

    # Generate code
    data = {"signature": signature, "model": "gpt_ft"}
    response2 = requests.post(end_point_code, json=data)
    implementation = response2.json()["implementation"]

    print(f"\nImplementation:\n{implementation}")

    adaptor_path = base_path / "Adaptor.js"
    f = open(adaptor_path, "w")
    f.write(implementation)
    f.close()
