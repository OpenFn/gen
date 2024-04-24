import logging
from typing import Union
from fastapi import HTTPException

import requests
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO)

# TODO - remove all the HTTP stuff from this
class SignatureGenerator:
    def __init__(self, endpoint_url: str):
        self.endpoint_url = endpoint_url
        self.logger = logging.getLogger(__name__)

    def generate(self, prompt: str) -> str:
        try:
            headers = {"Content-Type": "application/json"}
            data = {"prompt": prompt}

            response = requests.post(self.endpoint_url, headers=headers, json=data)
            response.raise_for_status()
            return response.json().get("generated_code")
        except requests.exceptions.HTTPError as e:
            error_message = f"HTTP error occurred: {e.response.status_code}, {e.response.text}, {self.endpoint_url}"
            self.logger.error(error_message)
            raise HTTPException(
                status_code=e.response.status_code, detail=error_message
            ) from e
        except Exception as e:
            error_message = f"An unexpected error occurred in code gen: {e}"
            self.logger.error(error_message)
            raise HTTPException(status_code=500, detail=error_message)


class SignatureInput(BaseModel):
    open_api_spec: Union[str, dict]
    instruction: str
    model: str = "codet5"
