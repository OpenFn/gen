import logging

from fastapi import APIRouter, HTTPException

from inference.models.gpt3_turbo import GPT3Turbo
from inference.schemas.models import CodeOutput, MessageInput

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize the GPT3 model
gpt3 = GPT3Turbo()


@router.post("/generate_code")
def generate_code(input_data) -> CodeOutput:
    """
    Generate code based on the provided input text using the GPT-3 model.
    The function handles HTTP POST requests and returns the generated code,
    or an appropriate error message if an issue occurs during code generation.
    """

    try:
        print(input_data)
        print(type(input_data))
        messages = input_data.messages
        print("messages", messages)
        generated_code = gpt3.generate(messages)
        if generated_code is None:
            raise HTTPException(
                status_code=500,
                detail="An error occurred during code generation",
            )
        return {"generated_code": [generated_code]}
    except Exception as e:
        logger.error(f"An error occurred during code generation: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}") from None
