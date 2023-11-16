import json
import logging
from pathlib import Path

import requests

logger = logging.getLogger(__name__)
end_point = "http://localhost:8003/generate_signature/"


# Opening JSON file
file_path = Path("tmp/spec.json")
with file_path.open("r") as file:
    full_spec = json.load(file)

spec = """
GET /cat
Response 200:
- Cat:
    name: string
    age: number
"""

instruction = """Create an OpenFn function that accesses the /breeds endpoint"""


data = {
    "open_api_spec": spec,
    "instruction": instruction,
    "model": "gpt3",
}
data_full = {
    "open_api_spec": full_spec,
    "instruction": instruction,
    "model": "gpt3",
}
data_default = {"open_api_spec": spec, "instruction": instruction}

#### v1
# For V1 use endpoint requests.post(end_point, json=data)


#### v2

end_point = "http://localhost:8003/generate_signature_v2/"
response = requests.post(end_point, json=data_full)
# results in response json() ["signature"]
