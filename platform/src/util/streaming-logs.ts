import path from "node:path";
import readline from "node:readline";
import { rm } from "node:fs/promises";
import crypto from "node:crypto";
import { spawn } from "node:child_process";

const END_LOG_DELIM = "***END***";

/**
 * This nasty little function sets up logfile and a watch
 * to capture the srdout from the python process
 * Python's logger is configured to write to this file,
 * which will be watched and then re-directed
 *
 * I'm never going to be able to unit test this
 *
 * TODO: I'd like this to just be a promise, it'll be a bit slicker,
 * But I'm still sketching it out really
 *
 */
export default (onLog = (_l: string) => {}, onComplete = () => {}) => {
  const id = crypto.randomUUID();

  // Init the log file
  const logfile = path.resolve(`tmp/logs/${id}.log`);
  Bun.write(logfile, "");
  console.log("Initing log file at", logfile);

  // Get a stream onto the log file

  // attempt #1: use bun shell
  // sadly bun shell doesn't support streams so I cant do this:
  // $`tail -f ${logfile}`;

  // attempt #2: use child process to spawn a tail --follow instead
  const child = spawn("tail", ["-f", logfile]);
  const rl = readline.createInterface({
    input: child.stdout,
    crlfDelay: Infinity,
  });

  // listen for new lines
  rl.on("line", (line) => {
    if (line === END_LOG_DELIM) {
      destroy();
      onComplete();
    } else {
      onLog(line);
    }
  });

  // kill the child process and remove the log file
  const destroy = async () => {
    child.kill();
    // console.log("Removing logfile at ", logfile);
    // await rm(logfile);
  };

  return { logfile, delimiter: END_LOG_DELIM, destroy };
};
