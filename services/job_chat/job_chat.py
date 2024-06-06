import os
from openai import OpenAI
from util import DictObj, createLogger
from .prompt import build_prompt

logger = createLogger("job_chat")

OPENAI_API_KEY = os.getenv(
    "OPENAI_API_KEY",
)


class Payload(DictObj):
    api_key: str
    content: str
    # history:
    # context:


def main(dataDict) -> dict:
    data = Payload(dataDict)
    result = generate(data.content, dataDict["history"], data.context, data.get("api_key"))
    return result


def generate(content, history, context, api_key) -> str:
    if api_key is None and isinstance(OPENAI_API_KEY, str):
        logger.warn("Using default API key from environment")
        api_key = OPENAI_API_KEY

    # should we let users drive this?
    model = "gpt-3.5-turbo"

    client = OpenAI(api_key=api_key)
    logger.info("OpenAI client loaded with {}".format(model))
    prompt = build_prompt(content, history, context)

    logger.info("--- PROMPT ---")
    logger.info(prompt)
    logger.info("--------------")

    try:
        logger.info("Generating")
        max_tokens = 256  # TODO maybe take an option for this?
        response = client.chat.completions.create(
            messages=prompt,
            model="gpt-3.5-turbo",
            temperature=0,
            max_tokens=max_tokens,
        )
        result = response.choices[0].message.content.strip()
        if result is None:
            logger.error("An error occurred during chat generation")
        else:
            logger.info("response from model:")
            logger.info(content)
            logger.info("done")

        history.append({"role": "user", "content": content})
        history.append({"role": "assistant", "content": result})

        return {"response": result, "history": history}
    except Exception as e:
        logger.error(f"An error occurred chat code generation: {e}")
