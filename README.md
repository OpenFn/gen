# Apollo Server

A bunjs-based webserver which hosts a number of data and code generation
services

## Reqiurements

- python 3.11 (yes, 3.11 exactly, see Python Setup)
- poetry
- bunjs

## Installation

Here's a funny thing.

`node-calls-python` relies on `node-gyp`.

I had to explicitly add node-gyp as a dependency to get this to work. I also had
to add node-calls-ppython as a trustedDependency.

Hopefully this will Just Work forever now, but I'm making a note here in case

Note that you currently HAVE to run `bun install` to build the node-calls-python
module. Using bun's native, no-install installation doesn't seem to work. I
would like to find a solution to this

(also, zero bun install means no intellisense from node_modules types, so maybe
bun install is fine)

## Getting Started

Install stuff:

- poetry install

- bun install

To start the server, run:

```bash
bun run start
```

## Python Setup

This repo uses `poetry` to manage dependencies.

We use an "in-project" venv , which means a `.venv` folder will be created when
you run `poetry install`.

We call out to a live python environment from node, using a library called
`node-calls-python`. We pass in the path to the local `.venv` folder so that the
node-python bindings can see your poetry environment.

The `node-calls-python` setup currently relies on a hard-coded python version.
If the python version is changed, this value will need updating.

## Python Modules

Any subfolder not starting with `_` in the `services` folder will be
automatically mounted at

```
/services/<service_name>
```

You need a `<service-name>.py` file in the root folder with a `main()` function.
This will be called by the web server when someone makes a post request to your
endpoint, passing the JSON payload as a dict.

The main function should return a JSON payload, which will be appended to the
response body and returned.

Inside your module folder, you can use whatever structure you like. Run
`poetry add <module>` to add dependencies (they'll be installed at the root
level `pyproject.toml`).

You should use relative paths to import py files in the service, or absolute
module names (relative to `/services/`).

The Javascript bridge will always call into `entry.py` and dyamically invoke
your service's main function, so technically speaking all imports are relative
to `entry.py`.

## Installing models

To add models as python packages:

- Copy the `.whl` file to `/models` at the repo root
- Add the file to poetry (you should be able to do
  `poetry add models/<my-model>.whl`)

## Code Style

Code should be formated with black

I've removed the old pre-commit hook (the idea of changing code invisibly,
before a commit, terrifes me utterly)

I need to:

1. install a linter which can fail in CI (or locally) if there are formatting
   issues
2. encourage here a format-on-save approach
3. make it really easy to install and configure Black?

Update: actually, for JS we use prettier. Why not just use prettier for both
languages?! We just need to ensure the setup is minimal
