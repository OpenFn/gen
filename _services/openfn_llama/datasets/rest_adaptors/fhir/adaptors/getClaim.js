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
 * Get Claim in a FHIR system
 * @public
 * @example
 * getClaim({ _include: "Claim:patient", _sort: "-_lastUpdated", _count: 200 });
 * @function
 * @param {string} claimId - (optional) claim id
 * @param {object} query - (optinal) query parameters
 * @param {function} callback - (Optional) callback function
 * @returns {Operation}
 */
export function getClaim(claimId, query, callback = s => s) {
    return state => {
        const [resourcedclaimId, resolvedQuery] = expandReferences(
            state,
            claimId,
            query
        );

        const { baseUrl, apiPath } = state.configuration;
        const url = resourcedclaimId
            ? `${baseUrl}/${apiPath}/Claim/${resourcedclaimId}`
            : `${baseUrl}/${apiPath}/Claim`;

        return request(url, { ...resolvedQuery }).then(response =>
            handleResponse(response, state, callback)
        );
    };
}