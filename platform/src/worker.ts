import py from "./py-env";

// this is called by a worker
console.log("~ Hello from the worker");

// prevents TS errors
declare var self: Worker;

type Event = MessageEvent<{ name: string }>;

type StartEvent = MessageEvent<{
  name: "start";
  script: string;
  streamLogs: boolean;
  args: any[];
}>;

self.onmessage = ({ data }: Event) => {
  if (data.name === "run") {
    run(data.script, data.args, data.streamLogs);
  }
};

async function run(scriptName: string, args: JSON, streamLogs: boolean) {
  console.log("~ run ", scriptName);
  try {
    const result = await py.run(scriptName, args, streamLogs ? log : undefined);
    console.log(" ~ result", result);

    // The result seems to not be cloneable...
    // Brute forcing it through this
    complete(JSON.parse(JSON.stringify(result)));
  } catch (e) {
    error(e);
  }
}

// send a log out of the worker
function log(message) {
  console.log("~", message);
  self.postMessage({
    name: "log",
    message,
  });
}

function complete(result: any) {
  self.postMessage({
    name: "complete",
    result,
  });
}

function error(error: any) {
  self.postMessage({
    name: "error",
    error,
  });
}
