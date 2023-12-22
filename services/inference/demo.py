import requests

# Define the URL of the FastAPI endpoint
endpoint_url = "http://localhost:8003/gpt3_turbo/generate_code/"

input_data = {"text": "def greet(user): print(f'hello <extra_id_0>!')"}
input_data2 = {"text": "Generate Javascript: get weather for a city"}
prompt = {
    "prompt": """
Generate TypeScript implementation for the function signature below. The comments above the function signature describe what it does.
Guides:
- Use async/await instead of promise chains.
- Create a new state via spread syntax: `const newState = { ...state, data: data }`.
- Ensure you import and use http from @openfn/language-common for HTTP requests (assume available).
- Copy the comments (see /**/) and include before function definition.
- Do not include the given type and function definitions in the output.

Signature:
/**
* Retrieves a list of breeds and includes it in the state data.
* Sends a GET request to the /breeds endpoint.
* @parameter callback {{Function}} - a callback which is invoked with the resulting state at the end of this operation. Allows users to customise the resulting state. State.data includes the response from Cat
* @returns A function that updates the state with the retrieved list of breeds.
*/
declare function GetCatBreeds(callback: (fn: (inState: State) => State)): (outState: State) => State;
type Breed = {{ breed: string; country: string; origin: string; coat: string; pattern: string; }};

type State<C = {{}}, D = {{}}> = {{ configuration: C; data: Breed[];}};

Code:
/* */
""",
}
response = requests.post(endpoint_url, json=prompt)
# print response json() ["generate_code"] [0]
