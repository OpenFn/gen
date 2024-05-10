# Inference

The inference service is designed as an entry-point to a number of langauge
models.

It takes an input prompt and a model name, and returns a single result. While it
was created for code generation, it could be used for anything.

It is generally used by other services.

## HTTP access

Although the inference service is designed to be called from python, you can
call it through HTTP:

```bash
curl -x POST localhost:3000/services/inference --json @tmp/input.json
```

The input data must contain a propt and a model. It can also contain extra
arguments, which will be passed through to the particular model you want to
call.

```json
{
  "prompt": "what is openfn?",
  "model": "gpt3_turbo",
  "args": {
    "key": "<OpenAI API Key>"
  }
}
```

Note that different models are likely to have different arguments - check the
specific model.py file for details!
