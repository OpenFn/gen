import logging 

from .models.gpt3_turbo import generate as gpt3_turbo
from .schemas import MessageInput

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Payload:
  def __init__(self, dict):
    self.model = dict['model']
    self.prompt = dict['prompt']

# This is the HTTP interface for direct calls
def main(dataDict):
  data = Payload(dataDict)
  
  # prompt is a list, which is wierd tbh
  # massage the prompt into the right shape
  result = generate(data.model, [{ 'role': 'user', 'content': data.prompt }])

  logger.info(result)

  return result

# This can be used by other modules
def generate(model, prompt):
    # TODO maybe I can use dynamic module resolution now?
    if (model == "gpt3_turbo"):
      return gpt3_turbo(prompt)
    return [""]