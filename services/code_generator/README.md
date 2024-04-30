# Code Generator

(TODO rename to adaptor code generator)

This service generates code to satisfy a function signature specified in
Typescript

This service is designed for use in the adaptor generator pipeline.

## Usage

Call the endpoint at `services/code_generator`

```bash
curl -X POST localhost:3000/services/code_generator --json @tmp/sig-cat.json
```

The payload should include a model and a signature:

```json
{
  "model": "gpt3_turbo",
  "api_key": "<your key here>",
  "signature": "\"/**\\n  * Retrieves information about cat breeds and includes it in the state data.\\n  * Sends a GET request to the /breeds endpoint of Cat.\\n  * @example\\n  * getCatBreeds(callback)\\n  * @function\\n  * @param {Function} callback - A callback which is invoked with the resulting state at the end of this operation. Allows users to customize the resulting state. State.data includes the response from Cat breeds endpoint.\\n  * @example <caption>Get information about cat breeds</caption>\\n  * getCatBreeds()\\n  * @returns {Function} A function that updates the state with the retrieved cat breeds information.\\n  */\\n  export function getCatBreeds(callback?: Function): Operation;\""
}
```
