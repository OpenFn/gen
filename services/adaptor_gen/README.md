# Adaptor Generator

This service generates an adaptor function based on an endpoint within an
OpenAPI spec.

It is designed at this stage to only generate a single function for a single
endpoint.

It returns a list of files and their contents (basically an Adaptor.js)

## Implementation Notes

This service uses a pipepline of other services to generate an adaptor function:

- First a signature is generated, in Typescript, from the openAPI spec. This
  uses the `signature_generator` and `inference` services.
- Then code is generated for that signature, using the `code_generator` and
  `inference` services.
- (TODO) Unit tests can also be generated

The resulting code is returned as a list of files in the JSON payload:

```json
{
  "Adaptor.js": "..."
}
```

## Usage

To use this service, call the endpoint:

```bash
curl -X POST localhost:3000/services/adaptor_gen --json @tmp/payload.json
```

The payload should include the following:

```json
{
  "endpoint": "/facts",
  "model": "gpt3_turbo",
  "api_key": "<your key here>",
  "open_api_spec": "{ .. }"
}
```

In dev the key can be loaded through an env var.
