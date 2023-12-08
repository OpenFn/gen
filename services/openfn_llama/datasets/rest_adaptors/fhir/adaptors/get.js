import { composeNextState } from '@openfn/language-common';

export function handleResponse(response, state, callback) {
    const nextState = {
        ...composeNextState(state, response),
        response,
    };
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
 * Get a resource in a FHIR system
 * @public
 * @example <caption>Get Claim from FHIR with optional query</caption>
 * get("Claim", { _include: "Claim:patient", _sort: "-_lastUpdated", _count: 200 })
 * @example <caption>Get Patient from FHIR</caption>
 * get('Patient');
 * @function
 * @param {string} path - Path to resource
 * @param {object} query - data to get the new resource
 * @param {function} callback - (Optional) callback function
 * @returns {Operation}
 */
export function get(path, query, callback = s => s) {
    return state => {
        const [resolvedPath, resolvedQuery] = expandReferences(state, path, query);

        const { baseUrl, apiPath } = state.configuration;
        const url = `${baseUrl}/${apiPath}/${resolvedPath}`;

        return request(url, { ...resolvedQuery }).then(response =>
            handleResponse(response, state, callback)
        );
    };
}