import {
    expandReferences,
    http,
} from '@openfn/language-common';

/**
 * Make a POST request
 * @public
 * @example
 *  post('/myEndpoint', {
 *    body: {'foo': 'bar'},
 *    headers: {'content-type': 'application/json'},
 *    authentication: {username: 'user', password: 'pass'}
 *  })
 * @function
 * @param {string} path - Path to resource
 * @param {object} params - Body, Query, Headers and Authentication parameters
 * @param {function} callback - (Optional) Callback function
 * @returns {operation}
 */
export function post(path, params, callback) {
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
            .post(config)(state)
            .then(response => handleResponse(state, response))
            .then(nextState => handleCallback(nextState, callback));
    };
}