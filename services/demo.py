import json
import logging
from pathlib import Path

import requests

logger = logging.getLogger(__name__)
end_point_signature = "http://localhost:8003/generate_signature_v2/"
end_point_code = "http://localhost:8004/generate_code/"


# Opening JSON file
file_path = Path("signature_generator/tmp/spec.json")
with file_path.open("r") as file:
    full_spec = json.load(file)


instruction = """Create an OpenFn function that accesses the /breeds endpoint"""

data_full = {
    "open_api_spec": full_spec,
    "instruction": instruction,
    "model": "gpt3",
}

# Generate signature
response = requests.post(end_point_signature, json=data_full)
# commented due to linting: results in response json() ["signature"]


# Generate code
signature = response.json()["signature"]
data = {"signature": signature}

response = requests.post(end_point_code, json=data)
# commented due to linting: results in response json() ["implementation"]
