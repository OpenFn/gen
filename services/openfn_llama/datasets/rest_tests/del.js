import {
    expandReferences,
    http,
} from '@openfn/language-common';

/**
 * Make a DELETE request
 * @public
 * @example
 *  del(`/myendpoint/${state => state.data.id}`, {
 *    headers: {'content-type': 'application/json'}
 *  })
 * @function
 * @param {string} path - Path to resource
 * @param {object} params - Body, Query, Headers and Auth parameters
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function del(path, params, callback) {
    return state => {
        const resolvedPath = expandReferences(path)(state);
        const resolvedParams = http.expandRequestReferences(params)(state);

        const url = setUrl(state.configuration, resolvedPath);

        const auth = setAuth(
            state.configuration,
            resolvedParams?.authentication ?? resolvedParams.auth
        );

        const config = mapToAxiosConfig({ ...resolvedParams, url, auth });

        return http
            .delete(config)(state)
            .then(response => handleResponse(state, response))
            .then(nextState => handleCallback(nextState, callback));
    };
}