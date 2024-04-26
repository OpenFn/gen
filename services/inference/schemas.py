from pydantic import BaseModel


class PromptInput(BaseModel):
    prompt: str


class RoleData(BaseModel):
    role: str
    content: str


class MessageInput(BaseModel):
    prompt: list[RoleData]


class CodeOutput(BaseModel):
    generated_code: list[str]


class GenOutput:
    text: str

    def __init__(self, result):
        self.text = result

    def __repr__(self):
        return self.text
