// node-python bridge
import { $ } from "bun";
import { interpreter as py } from "node-calls-python";
import path from "node:path";
import readline from "node:readline";
import fs from "node:fs";
import { rm } from "node:fs/promises";
import crypto from "node:crypto";
import { spawn } from "node:child_process";

// Use the major.minor python version to find the local poetry venv
// see https://github.com/OpenFn/gen/issues/45
const PYTHON_VERSION = "3.11";

const allowReimport = process.env.NODE_ENV !== "production";

if (allowReimport) {
  console.log(
    "Running server in dev mode. Python scripts will be re-loaded on every call."
  );
}

/**
 * This nasty little function sets up logfile and a watch
 * to capture the srdout from the python process
 * Python's logger is configured to write to this file,
 * which will be watched and then re-directed
 *
 * TODO: I'd like this to just be a promise, it'll be a bit slicker,
 * But I'm still sketching it out really
 *
 */
const setupLogger = (onLog = (_l: string) => {}, onComplete = () => {}) => {
  const id = crypto.randomUUID();

  const logfile = path.resolve(`tmp/logs/${id}.log`);
  Bun.write(logfile, "");
  console.log("node reading logs from", logfile);

  // attempt #1: use bun shell
  // sadly bun shell doesn't support streams so I cant do this:
  // $`tail -f ${logfile}`;

  // attempt #2: use child process
  // This is me trying not to spawn a process to run python. hmm.
  const child = spawn("tail", ["-f", logfile]);
  const rl = readline.createInterface({
    input: child.stdout,
    crlfDelay: Infinity,
  });
  rl.on("line", (line) => {
    if (line === "***END***") {
      destroy();
      onComplete();
    } else {
      onLog(line);
    }
  });

  // kill the child process and remove the log file
  const destroy = async () => {
    child.kill();

    await rm(logfile);
  };

  return { logfile, destroy };
};

// TODO I need to make this blocking so that only one thing runs at once
// OR I drop workerpool onto it
export const run = async (
  scriptName: string,
  args: JSON,
  onLog?: (str: string) => void
) => {
  try {
    // poetry should be configured to use a vnv in the local filesystem
    // This makes it really easy to tell node-calls-python about the right env!
    // IMPORTANT: if the python version changes, this path needs to be manually updated!
    py.addImportPath(
      path.resolve(`.venv/lib/python${PYTHON_VERSION}/site-packages`)
    );
    py.addImportPath(path.resolve("services"));

    if (allowReimport) {
      // In production, only import a module once
      // But in dev, re-import every time
      py.reimport("/services/");
    }

    return new Promise(async (resolve, reject) => {
      let result: any;

      const onComplete = () => {
        resolve(result);
      };

      const { logfile, destroy } = setupLogger(onLog, onComplete);

      // import from a top level entry point
      const pymodule = await py.import(
        path.resolve(`./services/entry.py`),
        allowReimport
      );

      try {
        result = await py.call(pymodule, "main", [scriptName, args, logfile]);
      } catch (e) {
        // Note that the error coming out will be a string with no stack trace :(
        console.log(e);
        destroy();
        reject(e);
      }
    });
  } catch (e) {
    // TODO I don't think we need this outer catch now
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
