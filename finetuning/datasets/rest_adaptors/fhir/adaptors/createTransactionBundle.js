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
 * Creates a transactionBundle for HAPI FHIR
 * @public
 * @example
 * createTransactionBundle({
 *   resourceType: "Bundle",
 *   type: "transaction",
 *   entry: [
 *     {
 *       fullUrl: "https://hapi.fhir.org/baseR4/Patient/592442",
 *       resource: {
 *         resourceType: "Patient",
 *         id: "592442",
 *         name: [{ given: "Caleb", family: "Cushing" }],
 *       },
 *       request: {
 *         method: "POST",
 *         url: "Patient",
 *       },
 *     },
 *   ],
 * });
 * @function
 * @param {object} params - data to create the new transaction
 * @param {function} callback - (Optional) callback function
 * @returns {Operation}
 */
export function createTransactionBundle(params, callback) {
    return state => {
        const [resolvedParams] = expandReferences(state, params);

        const { baseUrl, apiPath, authType, token } = state.configuration;

        const url = `${baseUrl}/${apiPath}`;
        const auth = `${authType} ${token}`;

        const options = {
            body: {
                resourceType: 'Bundle',
                type: 'transaction',
                entry: resolvedParams,
            },
            auth,
        };

        return request(url, options, 'POST').then(response =>
            handleResponse(response, state, callback)
        );
    };
}