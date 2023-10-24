import logging

from fastapi import FastAPI

from inference.api import codet5
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
    return {"Code Generation Service": "running"}


app.include_router(codet5.router, prefix="/codet5", tags=["code generation"])

if __name__ == "__main__":
    # Use this for debugging purposes only
    import uvicorn

    uvicorn.run(app, host=HOST, port=PORT, log_level="debug")
