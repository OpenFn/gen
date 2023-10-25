from pydantic import BaseModel


class T5TextInput(BaseModel):
    text: str


class T5CodeOutput(BaseModel):
    generated_code: list[str]


class ObjectDetectionResponse(BaseModel):
    bounding_boxes: list
    confidence_scores: list
    classes: list
