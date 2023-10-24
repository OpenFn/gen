from logging import Logger

from fastapi import APIRouter, HTTPException

from inference.models.codet5 import CodeT5
from inference.schemas.models import T5CodeOutput, T5TextInput

router = APIRouter()

# Initialize the CodeT5 model
code_t5 = CodeT5()


@router.post("/generate_code")
def generate_code(input_data: T5TextInput) -> T5CodeOutput:
    """
    Generate code based on the provided input text using the CodeT5 model.
    The function handles HTTP POST requests and returns the generated code,
    or an appropriate error message if an issue occurs during code generation.
    """

    try:
        text = input_data.text
        generated_code = code_t5.generate_code(text)
        if generated_code is None:
            raise HTTPException(
                status_code=500,
                detail="An error occurred during code generation",
            )
        return {"generated_code": generated_code}
    except Exception as e:
        Logger.error(f"An error occurred during code generation: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}") from None
