from pydantic import BaseModel


class PromptInput(BaseModel):
    prompt: str
    use_base_model: bool = 0


class CodeOutput(BaseModel):
    generated_code: list[str]
