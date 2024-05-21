import readline from "node:readline";
import path from "node:path";
import { spawn } from "node:child_process";

/**
  Run a python script
  Each script will be run in its own thread because
  1) It saves script writers having to worry about long writing process
  2) Removes any risk of stale credentials and ensures a pristine environment
  3) it makes capturing logs a bit easier
*/
export const run = async (
  scriptName: string,
  args: JSON,
  onLog?: (str: string) => void
) => {
  return new Promise(async (resolve, reject) => {
    const id = crypto.randomUUID();

    const tmpfile = path.resolve(`tmp/data/${id}-{}.json`);

    const inputPath = tmpfile.replace("{}", "input");
    const outputPath = tmpfile.replace("{}", "output");

    console.log("Initing input file at", inputPath);
    await Bun.write(inputPath, JSON.stringify(args));

    console.log("Initing output file at", outputPath);
    await Bun.write(outputPath, "");

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
    //       resolve(JSON.parse(text));
    //     },
    //   }
    // );

    // Use nodejs spawn
    // I seem to have to use this because the bun stream doesn't work with readline
    const proc = spawn("poetry", [
      "run",
      "python",
      "services/entry.py",
      scriptName,
      inputPath,
      outputPath,
    ]);

    proc.on("close", async () => {
      const result = Bun.file(outputPath);
      const text = await result.text();
      if (text) {
        resolve(JSON.parse(text));
      }
      // else ?
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

    return;
  });
};
