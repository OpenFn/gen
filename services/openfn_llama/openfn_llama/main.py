import logging

from fastapi import FastAPI, HTTPException

from openfn_llama.utils.constants import HOST, PORT
from openfn_llama.utils.schemas import CodeOutput, PromptInput
from openfn_llama.llama2 import Llama2_7B

# Configure logging
logging.basicConfig(
    filename="app.log",
    level=logging.ERROR,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)

logger = logging.getLogger(__name__)

app = FastAPI(title="Llama2-7b-hf Inference Service", openapi_url="/openapi.json")

llama2 = Llama2_7B()


@app.get("/", status_code=200)
async def root() -> dict:
    """
    Root GET
    """
    return {"Llama2-7b-hf Inference Service": "running"}


@app.post("/generate_code", status_code=200)
async def generate_code(input_data: PromptInput) -> CodeOutput:
    """
    Generate code based on the provided signature using the Llama-2-7b-hf model.
    The function handles HTTP POST requests and returns the generated code,
    or an appropriate error message if an issue occurs during code generation.
    """

    try:
        prompt = input_data.prompt
        if input_data.use_base_mode:
            generated_code = llama2.generate(prompt, use_base_model=True)
        else:
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


if __name__ == "__main__":
    # Use this for debugging purposes only
    import uvicorn

    uvicorn.run(app, host=HOST, port=PORT, log_level="debug")
