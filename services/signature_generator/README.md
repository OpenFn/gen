## Signature Generator

This service generates a Typescript signature for an adaptor to serve ONE
endpoint of a REST API.

An OpenAPI spec of the Rest API must be included in the request.

This service is designed for use in the adaptor generator pipeline.

## Usage

Call the endpoint at `services/signature_generator`

```bash
curl -X POST localhost:3000/services/signature_generator --json @tmp/sig-cat.json
```

## Payload

To call the service, include the following JSON payload:

```json
{
  "model": "gpt3_turbo", // the only model supported right now
  "instruction": "Create an OpenFn function that accesses the /breeds endpoint", // A prompt to pass to the model (TODO: this should just be the endpoint name)
  "open_api_spec": {}, // A JSON OpenAPI spc to generate against
  "api_key": "..." // An API key for the model (openai)
}
```

## API Keys

You should include an `api_key` in your JSON payload in order for the inference
to run.

For local testing, if an api key is not included in the payload, the inference
service may try to load one from the environment. A warning will be logged if
this is the case.

## Implementation Details

This service is mostly concerned with generating the prompt that will be sent to
the model. The heavy-lifting is handled by the inference service.

The service is intentionally restricted to only generate a single signature for
a single endpoint.
