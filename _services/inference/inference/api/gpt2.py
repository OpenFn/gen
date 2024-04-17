import logging

from fastapi import APIRouter, HTTPException

from inference.models.gpt2 import GPT2
from inference.schemas.models import CodeOutput, PromptInput

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize the GPT2 model
gpt2 = GPT2()


@router.post("/generate_code")
def generate_code(input_data: PromptInput) -> CodeOutput:
    """
    Generate code based on the provided input text using the GPT-2 model.
    The function handles HTTP POST requests and returns the generated code,
    or an appropriate error message if an issue occurs during code generation.
    """

    try:
        prompt = input_data.prompt
        generated_code = gpt2.generate(prompt)
        if generated_code is None:
            raise HTTPException(
                status_code=500,
                detail="An error occurred during code generation",
            )
        return {"generated_code": generated_code}
    except Exception as e:
        logger.error(f"An error occurred during code generation: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}") from None
