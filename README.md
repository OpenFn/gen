# Apollo Server

A bunjs-based webserver which hosts a number of data and code generation
services

## Pre-requisistes

- python3
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
