import requests

# Define the URL of the FastAPI endpoint
endpoint_url = "http://localhost:8002/codet5/generate_code/"

input_data = {"text": "def greet(user): print(f'hello <extra_id_0>!')"}
input_data2 = {"text": "Generate Javascript: get weather for a city"}
response = requests.post(endpoint_url, json=input_data2)
