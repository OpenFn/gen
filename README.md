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

## Getting Started

Install stuff:

- poetry install

- bun install

To start the server, run:

```bash
bun run start
```
