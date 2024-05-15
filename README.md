# Apollo Server

Apollo is OpenFn's knowledge, AI and data platform, providing services to
support the OpenFn toolchain.

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

You also need `python3-dev`, `g++` and `make` to be installted:

```
sudo apt install python3-dev make g++
```

## Getting Started

To run the server locally, run:

- `poetry install`
- `bun install`

To start the server for local developement, run:

```bash
bun dev
```

Any changes to the typescript files will trigger the server to be re-loaded. All
python scripts will be re-laoded on each call. So you should rarely, if ever,
need to restart the server.

To start in production mode, run:

```bash
bun start
```

In production mode, nothing will hot reload and python modules are cached.

To see an index of the available language services, head to `localhost:3000`.

## Finetuning and dependency groups

`poetry install` will only install the main dependencies - the stuff used in the
docker image.

Dependencies for finetuning (which include huge models) are in a special
optional `ft` group in the `pyproject.toml`.

To install these, do `poetry install --with ft`

## CLI

To communicate with and test the server, you can use `@openfn/cli`.

Use the `apollo` command with your service name and pass a json file:

```
openfn apollo echo tmp/payload.json
```

Pass `--staging`, `--production` or `--local` to call different deployments of
apollo.

To default to using your local server, you can set an env var:

```
export OPENFN_APOLLO_DEFAULT_ENV=local
```

Or pass an explicit URL if you're not running on the default port:

```
export OPENFN_APOLLO_DEFAULT_ENV=http://locahost:6666
```

Output will be shown in stdout by default. Pass `-o path/to/output/.json` to
save the output to disk.

You can get more help with:

```
openfn apollo help
```

Note that if a service returns `{ files: {} }` object in the payload, an you
pass `-o` with a folder, those files will be written to disk .

## API Keys & Env vars

Some services require API keys.

Rather than coding these into your JSON payloads directly, keys can be loaded
from the `.env` file at the root.

Also note that `tmp` dirs are untracked, so if you do want to store credentials
in your json, keep in inside a tmp dir and it'll remain safe and secret.

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

All python is invoked through `entry.py`, which loads the environment properly
so that relative imports work.

You can invoke entry.py directly (ie, without HTTP) through bun from the root:

```
bun py echo tmp/payload.json
```

## Installation Troubleshooting

- Ensure all dependencies are installed
- Ensure you've run `bun install` (unusual for Bun)
- Maybe install node-gyp explicitly?
- Ensure that `node-calls-python` has been built. In
  `node_modules/node-calls-python` there should be a `Relesae` folder with stuff
  inside.

## Docker

To build the docker image:

```bash
docker build .  -t openfn-apollo
```

To run it on port 3000

```bash
docker run -p 3000:3000 openfn-apollo
```

## Contributing

See the Contribution Guide for more details about how and where to contribute to
the Apollo platform.
