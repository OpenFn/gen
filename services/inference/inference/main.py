import os
import logging

from fastapi import FastAPI

from inference.api import codet5, gpt2, gpt3, gpt3_turbo, gpt_ft, llama2
from inference.schemas.constants import HOST, PORT

# Configure logging
logging.basicConfig(
    filename="app.log",
    level=logging.ERROR,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)

app = FastAPI(title="Code Generation Inference Service", openapi_url="/openapi.json")


@app.get("/", status_code=200)
async def root() -> dict:
    """
    Root GET
    """
    return {"Inference Service": "running"}


# app.include_router(codet5.router, prefix="/codet5", tags=["CodeT5 generation"])
# app.include_router(gpt2.router, prefix="/gpt2", tags=["GPT2 generation"])
# app.include_router(gpt3.router, prefix="/gpt3", tags=["GPT3 generation"])
app.include_router(
    gpt3_turbo.router, prefix="/gpt3_turbo", tags=["GPT3.5 Turbo generation"]
)
app.include_router(gpt_ft.router, prefix="/gpt_ft", tags=["GPT-FT generation"])
# app.include_router(llama2.router, prefix="/llama2", tags=["LLaMA-2 generation"])

if __name__ == "__main__":
    # Use this for debugging purposes only
    import uvicorn

    uvicorn.run(app, host=HOST, port=PORT, log_level="debug")
