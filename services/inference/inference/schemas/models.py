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


class ObjectDetectionResponse(BaseModel):
    bounding_boxes: list
    confidence_scores: list
    classes: list
