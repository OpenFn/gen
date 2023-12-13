import json
import logging
from pathlib import Path
import requests

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# API endpoints
ENDPOINT_SIGNATURE = "http://localhost:8003/generate_signature/"
ENDPOINT_CODE = "http://localhost:8004/generate_code/"
ENDPOINT_TEST = "http://localhost:8004/generate_test/"

# Samples and models for generation
SAMPLES = ["mailchimp", "cat-facts", "dhis2", "fhir"]
FT_MODEL_NAME = "gpt_ft"
MODEL_NAME = "gpt3_turbo"
# MODELS = ["codeT5", "gpt2", "gpt3_turbo", "gpt_ft", "llama2"]


def post_request(endpoint, payload):
    """Send a POST request to a specified endpoint with the given payload."""
    try:
        response = requests.post(endpoint, json=payload)
        response.raise_for_status()  # Raise an HTTPError if the HTTP request returned an unsuccessful status code
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"Request failed: {e}")
        return None


def write_to_file(path, content):
    """Write content to a file at the specified path."""
    with path.open("w") as file:
        file.write(content)
    logger.info(f"Content written to {path}")


def main():
    for sample in SAMPLES:
        logger.info(f"Processing sample: {sample}")
        base_path = Path(f"../samples/{sample}")

        # Load spec and instruction
        with (base_path / "spec.json").open("r") as spec_file:
            full_spec = json.load(spec_file)
        with (base_path / "instruction.txt").open() as instr_file:
            instruction = instr_file.read()

        # Generate signature
        logger.info(f"Generating signature for {sample}")
        signature_payload = {"open_api_spec": full_spec, "instruction": instruction, "model": MODEL_NAME}
        signature_response = post_request(ENDPOINT_SIGNATURE, signature_payload)

        if signature_response:
            signature = signature_response.get("signature")
            write_to_file(base_path / "Adaptor.d.ts", signature)

            # Generate code
            logger.info(f"Generating code for {sample}")
            code_payload = {"signature": signature, "model": FT_MODEL_NAME}
            code_response = post_request(ENDPOINT_CODE, code_payload)

            if code_response:
                implementation = code_response.get("implementation")
                write_to_file(base_path / "Adaptor.js", implementation)

                # Generate test
                logger.info(f"Generating test for {sample}")
                test_payload = {"implementation": implementation, "model": FT_MODEL_NAME}
                test_response = post_request(ENDPOINT_TEST, test_payload)

                if test_response:
                    test_code = test_response.get("test")
                    write_to_file(base_path / "Adaptor.test.js", test_code)
                else:
                    logger.error(f"Failed to generate tests for {sample}")
            else:
                logger.error(f"Failed to generate code for {sample}")
        else:
            logger.error(f"Failed to generate signature for {sample}")


if __name__ == "__main__":
    main()
