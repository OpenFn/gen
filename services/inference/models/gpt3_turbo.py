import logging
import os

from openai import OpenAI
from ..schemas import CodeOutput

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# TODO this API key should be in the request, not the env
OPENAI_API_KEY = os.getenv(
    "OPENAI_API_KEY",
)

"""
Generates a response from the GPT-3.5 Turbo model
"""
def generate(prompt) -> CodeOutput:
    # for now we'll create a new client for every request
    # idk the pros or cons of this - check the docs I guess!
    client = OpenAI(api_key=OPENAI_API_KEY)
    logger.info(f"OpenAI GPT-3.5 Turbo client loaded.")

    try:
        logger.info("Generating")
        max_tokens = 256 # TODO maybe take an option for this?
        response = client.chat.completions.create(
            messages=prompt,
            model="gpt-3.5-turbo",
            temperature=0,
            max_tokens=max_tokens,
        )
        result = response.choices[0].message.content.strip()

        if result is None:
            logger.error("An error occurred during GPT-3.5 Turbocode generation")
        else:
            logger.info('done')

        return {"result": [result]}
    except Exception as e:
        logger.error(f"An error occurred during GPT-3.5 Turbo code generation: {e}")
