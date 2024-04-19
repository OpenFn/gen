import { readdir } from "node:fs/promises"; // no bun api yet

type ModuleDescription = {
  name: string;

  // TODO - pull out metadata from each
  summary?: string;
  readme?: string;
};

// TODO this is just a stub right now
export default async (location: string): Promise<ModuleDescription[]> => {
  const dirs = await readdir(location);
  return dirs.map((name) => ({ name }));
};
