// node-python bridge

import nodecallspython from "node-calls-python";
import path from "node:path";

const py = nodecallspython.interpreter;

// TODO: should we load modules on startup or ondemand?
// Obviously if we have a lot of services and we load on startup, it'll slow the server
// Ok so the TODO here is to import modules on command
// (and maybe preload some core stuff)
export const run = async (scriptName: string, args: JSON) => {
  try {
    const pymodule = await py.import(
      path.resolve(`./services/${scriptName}/${scriptName}.py`),
      true
    );

    const result = await py.call(pymodule, scriptName, args);

    return result;
  } catch (e) {
    console.log(e);
  }
};
