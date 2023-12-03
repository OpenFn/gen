def get_model_endpoint(model_name: str) -> str:
    """
    Get the endpoint for the model
    """
    if model_name == "llama2":
        endpoint = "http://localhost:8005/llama2/generate_code/"
    else:
        endpoint = f"http://localhost:8002/{model_name.lower()}/generate_code/"
    return endpoint
