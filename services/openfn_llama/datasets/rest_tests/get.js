import {
    expandReferences,
    http,
  } from '@openfn/language-common';

/**
 * Make a GET request
 * @public
 * @example
 *  get('/myEndpoint', {
 *    query: {foo: 'bar', a: 1},
 *    headers: {'content-type': 'application/json'},
 *    authentication: {username: 'user', password: 'pass'}
 *  })
 * @function
 * @param {string} path - Path to resource
 * @param {object} params - Query, Headers and Authentication parameters
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function get(path, params, callback) {
    return state => {
      const resolvedPath = expandReferences(path)(state);
      const resolvedParams = http.expandRequestReferences(params)(state);
  
      const url = setUrl(state.configuration, resolvedPath);
  
      const auth = setAuth(
        state.configuration,
        resolvedParams?.authentication ?? resolvedParams?.auth
      );
  
      const config = mapToAxiosConfig({ ...resolvedParams, url, auth });
  
      return http
        .get(config)(state)
        .then(response => handleResponse(state, response))
        .then(nextState => handleCallback(nextState, callback));
    };
  }