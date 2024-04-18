# debian bun includes pythonn (for node-gyp)
FROM oven/bun:1.1.4-debian

# the bun image should do this but it doesn't work?
RUN apt-get update -qq \
  && apt-get install -qq \
  python3 \
  python3-dev \
  curl \
  make \
  g++ \
  # https://bugs.launchpad.net/ubuntu/+source/python3.6/+bug/1768644
  dpkg-dev

# node-gyp will fail to run unless node.js is installed
RUN curl -sL https://deb.nodesource.com/setup_20.x  | /bin/bash -
RUN apt-get -y install nodejs

WORKDIR /app

COPY ./pyproject.toml ./poetry.lock ./
COPY ./package.json bun.lockb ./

COPY ./platform/ ./platform
COPY ./services/ ./services

# RUN pip install --upgrade pip
# RUN pip install 'poetry'
# RUN poetry config virtualenvs.create false
# RUN poetry install --no-dev --no-root

RUN bun install

EXPOSE 3000

CMD ["bun", "start"]
