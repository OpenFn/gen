// node-python bridge

import nodecallspython from "node-calls-python";
import path from "node:path";

const py = nodecallspython.interpreter;

// TODO: should we load modules on startup or ondemand?
// Obviously if we have a lot of services and we load on startup, it'll slow the server
// Ok so the TODO here is to import modules on command
// (and maybe preload some core stuff)
export const run = async (scriptName: string, fnName: string, args: JSON) => {
  try {
    // poetry should be configured to use a vnv in the local filesystem
    // This makes it really easy to tell node-calls-python about the right env!
    // TODO: Ah,not THAT easy, we need to work out the python version
    py.addImportPath(path.resolve(".venv/lib/python3.11/site-packages"));

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
