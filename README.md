# Apollo Server

Apollo is OpenFn's knowledge, AI and data platform, provided services to support
the OpenFn toolchain.

Apollo is known as the God of (among other things) truth, prophecy and oracles.

This repo contains:

- A bunjs-based webserver
- A number of python-based AI services
- (soon) A numberof Typescript-based data services

## Requirements

To run this server locally, you'll need the following dependencies to be
installed:

- python 3.11 (yes, 3.11 exactly, see Python Setup)
- poetry
- bunjs

TODO: You also need make and pythion dev for `node-calls-python-, right?

## Getting Started

To run the server locally, run:

- `poetry install`
- `bun install`

To start the server, run:

```bash
bun start
```

To start in dev mode (with hot reloading on python scripts), run:

```bash
bun watch
```

To see an index of the available language services, head to `localhost:3000`.

## CLI

To communicate with and test the server, you can use `@openfn/cl`.

TODO: this needs implemnenting and this section needs to be filled out with
usage examples.

## Contributing

See the Contribution Guide for more details about how and where to contribute to
the Apollo platform.

## Local development

- `bun watch` will reload the typescript platform & python services whenever
  there's a change
- use the .env in services to configure your environment
- use url or the CLI to test your endpoints
- see the contributing guide for more details
- tmp folders are untracked. You should save test payloads in those

Note that we canont yet use `bun --watch` to restart the server, because we also
need to track changes in python land. So for no we use nodemon

## Environments

TODO - this section is work in progress

Some services require API keys.

Rather than coding these into your JSON payloads directly, key s can be loaded
from the .env file at the root. [Citation needed]

## Server Architecture

The Apollo server uses bunjs with the Elysia framework.

It is a very lightweight server, with at the time of writing no authentication
or governance included.

Python services are hosted at `/services/<name>`. Each services expects a POST
request with a JSON body, and will return JSON.

There is very little standard for formality in the JSON structures to date. The
server may soon establish some conventions for better interopability with the
CLI.

The JS engine calls out to a long-running python process using
`node-calls-python`. Python modules are pretty free-form but must adhere to a
minimal structure. See the Contribution Guide for details.

## Python Setup

This repo uses `poetry` to manage dependencies.

We use an "in-project" venv , which means a `.venv` folder will be created when
you run `poetry install`.

We call out to a live python environment from node, using a library called
`node-calls-python`. We pass in the path to the local `.venv` folder so that the
node-python bindings can see your poetry environment.

The `node-calls-python` setup currently relies on a hard-coded python version.
If the python version is changed, this value will need updating.

## Installation Troubleshooting

- Ensure all dependencies are installed
- Ensure you've run `bun install` (unusual for Bun)
- Maybe install node-gyp explicitly?
- Ensure that `node-calls-python` has been built. In
  `node_modules/node-calls-python` there should be a `Relesae` folder with stuff
  inside.
