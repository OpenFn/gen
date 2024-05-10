## Echo

A simple test service which returns whatever is passed into it.

## Usage

Call the endpoint at `services/echo`

```bash
curl -X POST localhost:3000/services/echo --json @tmp/data.json
```

Whatever you include in the body will be be returned straight back.
