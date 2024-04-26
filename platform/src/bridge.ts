// node-python bridge
import { $ } from "bun";
import nodecallspython from "node-calls-python";
import path from "node:path";

// Use the major.minor python version to find the local poetry venv
// see https://github.com/OpenFn/gen/issues/45
const PYTHON_VERSION = "3.11";

const py = nodecallspython.interpreter;

export const run = async (scriptName: string, args: JSON) => {
  try {
    // poetry should be configured to use a vnv in the local filesystem
    // This makes it really easy to tell node-calls-python about the right env!
    // IMPORTANT: if the python version changes, this path needs to be manually updated!
    py.addImportPath(
      path.resolve(`.venv/lib/python${PYTHON_VERSION}/site-packages`)
    );
    py.addImportPath(path.resolve("services"));

    // In production, only import a module once
    // But in dev, re-import every time
    const cache = process.env.NODE_ENV !== "production";

    // import from a top level entry point
    const pymodule = await py.import(
      path.resolve(`./services/entry.py`),
      cache
    );

    const result = await py.call(pymodule, "main", [scriptName, args]);
    return result;
  } catch (e) {
    // Note that the error coming out will be a string with no stack trace :(
    console.log(e);
  }
};

// Try to dynamically lookup the python version
// This is super unreliable - we're actually better
// off witha hard-coded value
const lookupPythonVersion = async () => {
  // TOOD what is the python executable?
  // Is this even what poetry is using?
  const version = await $`python3 --version`.text(); // absolutely sick, unbelievable
  // this is too hard - is there a better way to do it?
  return version.replace("Python ", "").split(".").slice(0, 2).join(".");
};
