import logging

# We have to use absolute paths because other services 
# call into this
from src.models.gpt3_turbo import GPT3Turbo
from src.schemas.models import CodeOutput, MessageInput

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize the GPT3 model
gpt3 = GPT3Turbo()

def generate_code(prompt) -> CodeOutput:
    """
    Generate code based on the provided input text using the GPT-3 model.
    The function handles HTTP POST requests and returns the generated code,
    or an appropriate error message if an issue occurs during code generation.
    """
    try:
        generated_code = gpt3.generate(prompt)
        if generated_code is None:
            logger.error("An error occurred during code generation")
        logger.info('done')

        # this is a nosense return - who even knows its code?
        # why is it in a list?
        return {"generated_code": [generated_code]}
    except Exception as e:
        logger.error(f"An error occurred during code generation: {e}")

    # try:
    #     messages = input_data.prompt
    #     generated_code = gpt3.generate(messages)
    #     if generated_code is None:
    #         logger.error("An error occurred during code generation")
    #         raise HTTPException(
    #             status_code=500,
    #             detail="An error occurred during code generation",
    #         )
    #     return {"generated_code": [generated_code]}
    # except Exception as e:
    #     logger.error(f"An error occurred during code generation: {e}")
    #     raise HTTPException(status_code=500, detail=f"An error occurred: {e}") from None
