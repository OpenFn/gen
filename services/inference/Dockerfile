FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9

WORKDIR /app

COPY ./pyproject.toml ./poetry.lock ./

ENV POETRY_VERSION=1.6.1
RUN pip install "poetry==$POETRY_VERSION"
ENV POETRY_VIRTUALENVS_CREATE=false

RUN poetry install --no-dev --no-root

COPY ./ .

EXPOSE 8003

CMD ["uvicorn", "inference.main:app", "--host", "0.0.0.0", "--port", "8003"]