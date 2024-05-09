// node-python bridge
import { $ } from "bun";
import { interpreter as py } from "node-calls-python";
import path from "node:path";
import readline from "node:readline";
import fs from "node:fs";

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

export const run = async (scriptName: string, args: JSON) => {
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

    const logfile = "dooby.txt";
    // TODO clear the log file

    // read the logs
    // const logs = Bun.file("dooby.txt");
    // const exists = await logs.exists();
    // console.log("EXISTS", exists);
    // const logStream = logs.stream();
    // console.log(readline.createInterface);

    // the bun interface seems to not work?
    // this will read the file once, get to eol, and return
    // // how would I re-trigger on write?
    // fs.watch("dooby.txt", (event) => {
    //   console.log(" -- changed!");
    //   console.log(event);
    // });

    // new Promise(async () => {
    //   for await (let line of $`tail -f ${logfile}`.lines()) {
    //     console.log(" >> ", line);
    //   }
    // });

    // const fileStream = fs.createReadStream("dooby.txt");
    // const rl = readline.createInterface({
    //   input: fileStream,
    //   crlfDelay: Infinity,
    // });

    // rl.on("line", (line) => {
    //   console.log(`Line from file: ${line}`);
    // });

    // attempt 321: use bun shell
    // sadly bun shell doesn't support streams so I cant do this:
    // $`tail -f ${logfile}`;

    // attempt 322: use child process
    // This is me trying not to spawn a process to run python. hmm.
    const { spawn } = require("child_process");
    const child = spawn("tail", ["-f", logfile]);
    // child.stdout.pipe(process.stdout);
    const rl = readline.createInterface({
      input: child.stdout,
      crlfDelay: Infinity,
    });
    rl.on("line", (line) => {
      console.log(`Line from file: ${line}`);
    });

    // import from a top level entry point
    const pymodule = await py.import(
      path.resolve(`./services/entry.py`),
      allowReimport
    );

    // process.stdout.write = (m) => {
    //   console.error(" >> ", m);
    // };

    const result = await py.call(pymodule, "main", [scriptName, args]);

    child.kill();
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
