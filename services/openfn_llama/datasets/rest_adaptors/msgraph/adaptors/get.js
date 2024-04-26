import { expandReferences } from '@openfn/language-common/util';
import {
  request,
  setUrl,
  handleResponse,
} from './Utils';

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

export function handleResponse(response, state, callback) {
  let nextState;
  // Don't compose state if response is a stream
  if (isStream(response)) {
    nextState = {
      ...state,
      data: response,
    };
  } else {
    nextState = {
      ...composeNextState(state, response),
      response,
    };
  }
  if (callback) return callback(nextState);
  return nextState;
}

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
 * Make a GET request to msgraph resource
 * @public
 * @example
 *  get('sites/root/lists')
 * @function
 * @param {string} path - Path to resource
 * @param {object} query - Query, Headers and Authentication parameters
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function get(path, query, callback = false) {
  return state => {
    const { accessToken, apiVersion } = state.configuration;
    const [resolvedPath, resolvedQuery] = expandReferences(state, path, query);

    const url = setUrl(resolvedPath, apiVersion);

    return request(url, { query: resolvedQuery, accessToken }).then(response =>
      handleResponse(response, state, callback)
    );
  };
}