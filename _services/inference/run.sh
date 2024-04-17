#!/bin/sh
source "$(poetry env info --path)/bin/activate"

echo $(poetry env info --path)

python --version

export APP_MODULE=${APP_MODULE-inference.main:app}
export HOST=${HOST:-0.0.0.0}
export PORT=${PORT:-8003}

exec uvicorn --reload --host $HOST --port $PORT "$APP_MODULE"
