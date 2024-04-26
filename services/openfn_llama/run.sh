#!/bin/sh
source "$(poetry env info --path)/bin/activate"

echo $(poetry env info --path)

python --version

export APP_MODULE=${APP_MODULE-openfn_llama.main:app}
export HOST=${HOST:-0.0.0.0}
export PORT=${PORT:-8004}

exec uvicorn --reload --host $HOST --port $PORT "$APP_MODULE"
