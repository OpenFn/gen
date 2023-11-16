import logging

import requests

logger = logging.getLogger(__name__)

# Define the URL of the FastAPI endpoint
endpoint_url = "http://localhost:8004/generate_code/"

data = {
    "signature": """
/**
    * Retrieves a list of breeds and includes it in the state data.
    * Sends a GET request to the /breeds endpoint.
    * @parameter callback {{Function}} - a callback which is invoked with the resulting state at the end of this operation. Allows users to customise the resulting state. State.data includes the response from Cat
    * @returns A function that updates the state with the retrieved list of breeds.
    */
    declare function GetCatBreeds(callback: (fn: (inState: State) => State)): (outState: State) => State;
        type Breed = {{ breed: string; country: string; origin: string; coat: string; pattern: string; }};

    type State<C = {{}}, D = {{}}> = {{ configuration: C; data: Breed[];}};
""",
}

response = requests.post(endpoint_url, json=data)
# results in response json() ["implementation"]
