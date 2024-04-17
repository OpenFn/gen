import { expandReferences } from '@openfn/language-common/util';


export function setUrl(resource, apiVersion) {
  if (isValidHttpUrl(resource)) return resource;

  const pathSuffix = apiVersion
    ? `${apiVersion}/${resource}`
    : `v1.0/${resource}`;
  return `https://graph.microsoft.com/${pathSuffix}`;
}

/**
 * This is an asynchronous function that sends a request to a specified URL with optional parameters
 * and headers, and returns the response data in JSON format.
 * @param {string} url - The URL of the API endpoint that the request is being made to.
 * @param {object} [options] - An object containing any additional parameters to be sent with the request, such
 * as query parameters or request body data. It is an optional parameter and defaults to an empty
 * object if not provided.
 * @returns The `request` function is returning the parsed JSON data from the response of the HTTP
 * request made to the specified `url` with the given `params` and `method`. If there is an error in
 * the response, the function will throw an error.
 */
export const request = async (path, params) => {
  let url = path;
  const options = { ...defaultOptions, ...params };
  const { parseAs, query, method, accessToken } = options;
  delete options.parseAs;
  delete options.accessToken;

  options.headers['Authorization'] = makeAuthHeader(accessToken);

  if (method === 'GET' && query) {
    url = `${path}?${new URLSearchParams(query).toString()}`;
  }

  const response = await fetch(url, options);
  const contentType = response.headers.get('Content-Type');

  // If not json then return a stream
  let data;
  if (parseAs) {
    if (parseAs === 'json') data = await response.json();
    if (parseAs === 'text') data = await response.text();
  } else {
    data = contentType?.includes('application/json')
      ? await response.json()
      : response.body;
  }

  handleResponseError(response, data, method);

  return data;
};

export function handleResponseError(response, data, method) {
  const { status, statusText, url } = response;

  if (!response.ok) {
    const errorString = [
      `Message: ${statusText}`,
      `Request: ${method} ${url}`,
      `Status: ${status}`,
      `Body: ${JSON.stringify(data, null, 2).replace(/\n/g, '\n\t  ')}`,
    ].join('\n\t∟ ');
    throw new Error(errorString);
  }
}

/**
 * Get a Drive or SharePoint document library. The drive metadata will be written
 * to state.drives, where it can be used by other adaptor functions.
 * Pass { id } to get a drive by id or { id, owner } to get default drive for
 * some parent resource, like a group
 * @public
 * @example <caption>Get a drive by ID</caption>
 * getDrive({ id: "YXzpkoLwR06bxC8tNdg71m" })
 * @example <caption>Get the default drive for a site</caption>
 * getDrive({ id: "openfn.sharepoint.com", owner: "sites" })
 * @param specifier {Object} - A definition of the drive to retrieve
 *    - id {string} - The ID of the resource or owner.
 *    - owner {string} - The type of drive owner (e.g. sites, groups).
 * @param {string} name - The local name of the drive used to write to state.drives, ie, state.drives[name]
 * @param {function} [callback = s => s] (Optional) Callback function
 * @return {Operation}
 */
export function getDrive(specifier, name = 'default', callback = s => s) {
  return state => {
    const { accessToken, apiVersion } = state.configuration;
    const [resolvedSpecifier, resolvedName] = expandReferences(
      state,
      specifier,
      name
    );

    const { id, owner = 'drive' } = resolvedSpecifier;

    let resource;
    if (owner === 'drive') {
      resource = `drives/${id}`;
    } else {
      resource = `${owner}/${id}/drive`;
    }

    const url = setUrl(resource, apiVersion);

    return request(url, { accessToken }).then(response => {
      state.drives[resolvedName] = response;
      return callback(state);
    });
  };
}