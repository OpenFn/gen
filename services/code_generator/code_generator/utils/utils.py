def get_model_endpoint(model_name: str) -> str:
    """
    Get the endpoint for the model
    """
    return f"http://localhost:8002/{model_name.lower()}/generate_code/"
