// node-python bridge
import { $ } from "bun";
import nodecallspython from "node-calls-python";
import path from "node:path";

const py = nodecallspython.interpreter;

// TODO: should we load modules on startup or ondemand?
// Obviously if we have a lot of services and we load on startup, it'll slow the server
// Ok so the TODO here is to import modules on command
// (and maybe preload some core stuff)
export const run = async (scriptName: string, fnName: string, args: JSON) => {
  try {
    // TOOD what is the python executable?
    const version = await $`python3 --version`.text(); // absolutely sick, unbelievable
    // this is too hard - is there a better way to do it?
    let minorPyVersion = version
      .replace("Python ", "")
      .split(".")
      .slice(0, 2)
      .join(".");

    // poetry should be configured to use a vnv in the local filesystem
    // This makes it really easy to tell node-calls-python about the right env!
    py.addImportPath(
      path.resolve(`.venv/lib/python${minorPyVersion}/site-packages`)
    );

    // TODO in dev mode I want to re-import the module every time
    // But in prod I wanna use the cached import
    const pymodule = await py.import(
      path.resolve(`./services/${scriptName}/${scriptName}.py`),
      true
    );

    const result = await py.call(pymodule, fnName, args);

    return result;
  } catch (e) {
    console.log(e);
  }
};
