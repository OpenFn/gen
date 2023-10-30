import requests
from pydantic import BaseModel

from signature_generator.utils.constants import SUCCESS_CODE


class SignatureGenerator:
    def __init__(self, endpoint_url: str):
        self.endpoint_url = endpoint_url

    def generate(self, prompt: str) -> str:
        try:
            headers = {"Content-Type": "application/json"}
            data = {"prompt": prompt}

            response = requests.post(self.endpoint_url, headers=headers, json=data)
            if response.status_code == SUCCESS_CODE:
                return response.json().get("generated_code")
            else:
                return "Error occurred during signature generation"

        except requests.exceptions.RequestException as e:
            return f"An error occurred: {e}"


class SignatureInput(BaseModel):
    open_api_spec: str
    instruction: str
