from inference.src.api.gpt3_turbo import generate_code
from inference.src.schemas.models import MessageInput

# TODO this needs to be callable direct from http
def generate(model, prompt):
    if (model == "gpt3_turbo"):
      return generate_code(prompt)
    return [""]