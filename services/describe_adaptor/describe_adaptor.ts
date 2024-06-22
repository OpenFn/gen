import { fetchDTSListing, fetchFile, getNameAndVersion } from "./util";

// TODO log streaming is not implemented yet
// This is not designed to be called from the CLI
export default (port: number, payload: any, onLog: any) => {
  return describePackage(payload.adaptor);
};

// This implementation is copied and adaptored from describe-package
export const describePackage = async (
  specifier: string
): Promise<Record<string, string>> => {
  const { name, version } = getNameAndVersion(specifier);

  const results: Record<string, string[]> = {};

  if (name != "@openfn/language-common") {
    console.log("Loading files for common...");
    const commonFiles: string[] = [];
    results["@openfn/language-common"] = commonFiles;

    // Include language-common in the project model
    // (I don't expect this to be permanent)

    // First work out the correct version
    const pkgStr = await fetchFile(`${specifier}/package.json`);
    const pkg = JSON.parse(pkgStr);

    if (pkg.dependencies["@openfn/language-common"]) {
      const commonSpecifier = `@openfn/language-common@${pkg.dependencies[
        "@openfn/language-common"
      ].replace("^", "")}`;

      const common = await fetchDTSListing(commonSpecifier);
      for await (const fileName of common) {
        const f = await fetchFile(`${commonSpecifier}${fileName}`);
        commonFiles.push(f);
      }
    }
    console.log("common done!");
  }

  console.log("Loading files for adaptor...");

  // Now fetch the listings for the actual package
  const fileNames = await fetchDTSListing(specifier);

  const packageFiles: string[] = [];
  results[name] = packageFiles;
  for await (const fileName of fileNames) {
    if (!/beta\.d\.ts$/.test(fileName)) {
      const f = await fetchFile(`${specifier}${fileName}`);
      packageFiles.push(f);
    }
  }

  console.log("adaptors done!");

  const finalResults: Record<string, string> = {};
  for (const k in results) {
    finalResults[k] = {
      name: k,
      description: results[k].join("\n\n"),
    };
  }

  return finalResults;
};
