#!/bin/sh
source "$(poetry env info --path)/bin/activate"

# export OPENAI_KEY=${OPENAI_KEY-'YOUR_KEY'}
export APP_MODULE=${APP_MODULE-inference.main:app}
export HOST=${HOST:-0.0.0.0}
export PORT=${PORT:-8002}

exec uvicorn --reload --host $HOST --port $PORT "OPENAI_KEY=$OPENAI_KEY" "$APP_MODULE"
