from pydantic import BaseModel


class PromptInput(BaseModel):
    prompt: str


class CodeOutput(BaseModel):
    generated_code: list[str]


class ObjectDetectionResponse(BaseModel):
    bounding_boxes: list
    confidence_scores: list
    classes: list
