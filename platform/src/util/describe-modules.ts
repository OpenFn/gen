import { readFile, readdir } from "node:fs/promises"; // no bun api yet

export type ModuleDescription = {
  name: string;

  // TODO - pull out metadata from each
  summary?: string;
  readme?: string;
};

// TODO this is just a stub right now
export default async (location: string): Promise<ModuleDescription[]> => {
  const dirs = await readdir(location, { withFileTypes: true });
  const services = dirs.filter(
    (dirent) => dirent.isDirectory() && !dirent.name.startsWith("_")
  );

  const result: ModuleDescription[] = [];
  for (const srv of services) {
    const s: ModuleDescription = {
      name: srv.name,
    };
    try {
      const rm = await readFile(`${location}/${srv.name}/README.md`, "utf8");

      const lines = rm.split("\n");
      // for a summary, find the first non-empty, non-title line
      let summary = "";
      for (const l of lines) {
        if (l.length && !l.startsWith("#")) {
          summary += " " + l;
        } else if (summary) {
          break;
        }
      }

      s.readme = rm;
      s.summary = summary;
    } catch (e) {
      s.readme = "No readme file found for this service";
      s.summary = "Service description not available";
    }

    result.push(s);
  }

  return result.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
    return 0;
  });
};
