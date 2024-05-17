import readline from "node:readline";

import { spawn } from "node:child_process";

// Run a python script
// Each script will be run in its own thread because
// 1) It saves scritp writers having to worry about long writing process
// 2) Removes any risk of stale credentials and ensures a pristine environment
// 3) it makes capturing logs a bit easier
// Difficulty: at the time of writing node-calls-python blows up

/*
 * Another approach to this would be to run a child process for python
 * pipe the stdout (which I think I can do)
 * and write the final result to a file to read back in
 */
export const run = async (
  scriptName: string,
  args: JSON,
  onLog?: (str: string) => void
) => {
  return new Promise(async (resolve, reject) => {
    const id = crypto.randomUUID();
    const outputPath = `tmp/${id}.json`;

    Bun.write(outputPath, "");
    console.log("Initing output file at", outputPath);
    // const proc = Bun.spawn(["pwd"]);

    // Ok, I don't want to use entry any more...
    // which ballses a few things up
    // const proc = Bun.spawn(
    //   [
    //     "poetry",
    //     "run",
    //     "python",
    //     "services/entry.py",
    //     scriptName,
    //     JSON.stringify(args),
    //   ],
    //   {
    //     onExit: async (proc, exitCode, signalCode, error) => {
    //       // exit handler
    //       const result = Bun.file("out.json");
    //       const text = await result.text();
    //       console.log(text);
    //       resolve(JSON.parse(text));
    //     },
    //   }
    // );

    // nodejs spawn
    // I seem to have to use this because the bun stream doesn't work with readline
    const proc = spawn("poetry", [
      "run",
      "python",
      "services/entry.py",
      scriptName,
      JSON.stringify(args),
      outputPath,
    ]);

    proc.on("close", async () => {
      const result = Bun.file(outputPath);
      const text = await result.text();
      resolve(JSON.parse(text));
    });

    const rl = readline.createInterface({
      input: proc.stdout,
      crlfDelay: Infinity,
    });
    rl.on("line", (line) => {
      // TODO this should be marked up locally so we can see where the log came from
      // shouldn't python be doing that? given logger names? I don't see it here
      console.log(line);
      onLog?.(line);
    });

    // const text = await new Response(proc.stdout).text();
    // console.log(text); // => "1.1.7"

    return;

    // create a worker instance
    const workerURL = new URL("worker.ts", import.meta.url).href;

    // reduced memory footprint. idk if this is wise?
    // https://bun.sh/docs/api/workers#memory-usage-with-smol
    // @ts-ignore
    //const worker = new Worker(workerURL, { smol: true});

    // we get a memory segmentation fault error on the second call
    // i think that's node-calls-python, it basically doesn't support two threads
    const worker = new Worker(workerURL);
    console.log("Creating worker ", worker.threadId);
    worker.unref();

    worker.addEventListener("open", () => {
      console.log("worker is ready");
      worker.postMessage({
        name: "run",
        script: scriptName,
        args: args,
        streamLogs: Boolean(onLog),
      });
    });
    worker.addEventListener("close", (event) => {
      console.log(`worker ${worker.threadId} is being closed`);
    });

    worker.addEventListener("message", ({ data }) => {
      if (data.name === "error") {
        worker.terminate();
        reject(data.error);
      } else if (data.name === "complete") {
        worker.terminate();
        resolve(data.result);
      } else if (data.name === "log") {
        onLog?.(data.message);
      }
    });
  });
};
