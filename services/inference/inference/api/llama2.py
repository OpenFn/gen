import logging

from fastapi import APIRouter, HTTPException

from inference.models.llama2 import Llama2_7B
from inference.schemas.models import CodeOutput, PromptInput

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize the llama2 model
llama2 = Llama2_7B()


@router.post("/generate_code")
def generate_code(input_data: PromptInput) -> CodeOutput:
    """
    Generate code based on the provided input text using the Llama-2-7b-hf model.
    The function handles HTTP POST requests and returns the generated code,
    or an appropriate error message if an issue occurs during code generation.
    """

    try:
        prompt = input_data.prompt
        generated_code = llama2.generate(prompt)
        if generated_code is None:
            raise HTTPException(
                status_code=500,
                detail="An error occurred during code generation",
            )
        return {"generated_code": generated_code}
    except Exception as e:
        logger.error(f"An error occurred during code generation: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}") from None
