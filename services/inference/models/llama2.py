import logging
import requests

from fastapi import APIRouter, HTTPException

logger = logging.getLogger(__name__)
router = APIRouter()


llama2_endpoint = "https://9a1b-31-12-82-146.ngrok-free.app/generate_code"  # Offline


# TODO this is likely broken
def generate_code(prompt: str) -> str:
    """
    Generate code based on the provided input text using the Llama-2-7b-hf model.
    The function handles HTTP POST requests and returns the generated code,
    or an appropriate error message if an issue occurs during code generation.
    """

    try:
        payload = {"prompt": prompt}
        response = requests.post(llama2_endpoint, json=payload)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            result = response.json().get("generated_code")
            return result
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Error from llama2 API: {response.text}",
            )
    except Exception as e:
        logger.error(f"An error occurred during code generation: {e}")
