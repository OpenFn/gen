export const getNameAndVersion = (specifier: string) => {
  let name;
  let version;

  const atIndex = specifier.lastIndexOf("@");
  if (atIndex > 0) {
    name = specifier.substring(0, atIndex);
    version = specifier.substring(atIndex + 1);
  } else {
    name = specifier;
  }

  return { name, version } as { name: string; version: string };
};

export async function fetchFile(path: string) {
  const resolvedPath = `https://cdn.jsdelivr.net/npm/${path}`;
  console.log(resolvedPath);
  const response = await fetch(resolvedPath);

  if (response.status === 200) {
    return response.text();
  }

  throw new Error(
    `Failed getting file at: ${path} got: ${response.status} ${response.statusText}`
  );
}

export async function fetchFileListing(packageName: string) {
  const response = await fetch(
    `https://data.jsdelivr.com/v1/package/npm/${packageName}/flat`
  );

  if (response.status != 200) {
    throw new Error(
      `Failed getting file listing for: ${packageName} got: ${response.status} ${response.statusText}`
    );
  }

  const listing = await response.json();
  return listing.files?.map(({ name }: any) => name);
}

const dtsExtension = /\.d\.ts$/;

export async function* fetchDTSListing(packageName: string) {
  for (const f of await fetchFileListing(packageName)) {
    if (dtsExtension.test(f)) {
      yield f;
    }
  }
}
