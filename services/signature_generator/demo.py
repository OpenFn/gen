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

data = {"open_api_spec": spec, "instruction": instruction}
response = requests.post(end_point, json=data)
