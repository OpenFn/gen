import logging
import requests

from fastapi import APIRouter, HTTPException

from inference.schemas.models import CodeOutput, PromptInput

logger = logging.getLogger(__name__)
router = APIRouter()


llama2_endpoint = "https://llama2.example.com/generate"


@router.post("/generate_code")
def generate_code(input_data: PromptInput) -> CodeOutput:
    """
    Generate code based on the provided input text using the Llama-2-7b-hf model.
    The function handles HTTP POST requests and returns the generated code,
    or an appropriate error message if an issue occurs during code generation.
    """

    try:
        # Assuming input_data is a dictionary with the 'prompt' key
        payload = {"prompt": input_data.prompt}

        # Send the prompt via POST request to the llama2 endpoint
        response = requests.post(llama2_endpoint, json=payload)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            # Get the generated code from the response
            generated_code = response.json().get("generated_code")
            return {"generated_code": generated_code}
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Error from llama2 API: {response.text}",
            )
    except Exception as e:
        logger.error(f"An error occurred during code generation: {e}")
