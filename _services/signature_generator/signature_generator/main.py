import logging

from fastapi import FastAPI

from signature_generator.api.routers import router
from signature_generator.utils.constants import HOST, PORT

# Configure logging
logging.basicConfig(
    filename="app.log",
    level=logging.ERROR,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)

app = FastAPI(title="Signature Generation Service", openapi_url="/openapi.json")


@app.get("/", status_code=200)
async def root() -> dict:
    """
    Root GET
    """
    return {"message": "The Signature Generator API is running!"}


app.include_router(router, tags=["Signature generation"])

if __name__ == "__main__":
    # Use this for debugging purposes only
    import uvicorn

    uvicorn.run(app, host=HOST, port=PORT, log_level="debug")
