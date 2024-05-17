import { interpreter as py } from "node-calls-python";
import { $ } from "bun";
import setupLogger from "./util/streaming-logs";

import path from "node:path";

// Use the major.minor python version to find the local poetry venv
// see https://github.com/OpenFn/gen/issues/45
const PYTHON_VERSION = "3.11";

// setup a python environment
// This makes it really easy to tell node-calls-python about the right env!
// IMPORTANT: if the python version changes, this path needs to be manually updated!
py.addImportPath(
  path.resolve(`.venv/lib/python${PYTHON_VERSION}/site-packages`)
);
py.addImportPath(path.resolve("services"));

function run(
  scriptName: string,
  args: JSON,
  onLog?: (str: string) => void | false
) {
  return new Promise(async (resolve, reject) => {
    let result: any;

    let logfile = null;
    let delimiter = ".";
    let destroy = () => {};

    const onComplete = () => {
      resolve(result);
    };

    if (onLog) {
      ({ logfile, delimiter, destroy } = setupLogger(onLog, onComplete));
    }

    // import from a top level entry point
    const pymodule = await py.import(
      path.resolve(`./services/entry.py`),
      false
    );

    try {
      result = await py.call(pymodule, "main", [
        scriptName,
        args,
        logfile,
        delimiter,
      ]);

      if (!onLog) {
        onComplete();
      }
    } catch (e) {
      // Note that the error coming out will be a string with no stack trace :(
      console.log(e);
      destroy();
      reject(e);
    }
  });
}

export default { run };
