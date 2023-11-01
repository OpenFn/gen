import logging

import requests

logger = logging.getLogger(__name__)
end_point = "http://localhost:8003/generate_signature/"


spec = """
GET /cat
Response 200:
- Cat:
    name: string
    age: number
"""

instruction = """Get a random cat."""

data = {"open_api_spec": spec, "instruction": instruction, "model_name": "gpt3"}
data_default = {"open_api_spec": spec, "instruction": instruction}
response = requests.post(end_point, json=data)


# UNCOMMENT if response.status_code == 200:
# UNCOMMENT    print(response.json())

end_token = "\\n\\n"

# Tests to take out irrelevant additions
signature = response.json()["generated_signature"]
if end_point in signature:
    signature = signature[: signature.find(end_token)]
