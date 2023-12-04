from typing import Union
from fastapi import HTTPException

import requests
from pydantic import BaseModel


class SignatureGenerator:
    def __init__(self, endpoint_url: str):
        self.endpoint_url = endpoint_url

    def generate(self, prompt: str) -> str:
        try:
            headers = {"Content-Type": "application/json"}
            data = {"prompt": prompt}

            response = requests.post(self.endpoint_url, headers=headers, json=data)
            if response.status_code == 200:
                return response.json().get("generated_code")
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Error from {self.endpoint_url} endpoint: {response.text}",
                )

        except requests.exceptions.RequestException as e:
            return f"An error occurred: {e}"


class SignatureInput(BaseModel):
    open_api_spec: Union[str, dict]
    instruction: str
    model: str = "codet5"
