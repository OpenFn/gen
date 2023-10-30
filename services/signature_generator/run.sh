#!/bin/sh

export APP_MODULE=${APP_MODULE-signature_generator.main:app}
export HOST=${HOST:-0.0.0.0}
export PORT=${PORT:-8003}

exec uvicorn --reload --host $HOST --port $PORT "$APP_MODULE"
