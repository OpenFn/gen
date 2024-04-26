import axios from 'axios';
import Qs from 'qs';

export function generateUrl(configuration, options, resourceType, path = null) {
    let { hostUrl, apiVersion } = configuration;
    const urlString = '/' + resourceType;

    // Note that users can override the apiVersion from configuration with args
    if (options?.apiVersion) apiVersion = options.apiVersion;

    const apiMessage = apiVersion
        ? `Using DHIS2 api version ${apiVersion}`
        : 'Using latest available version of the DHIS2 api on this server.';

    console.log(apiMessage);

    const url = buildUrl(urlString, hostUrl, apiVersion);

    if (path) return `${url}/${path}`;
    return url;
}

export function handleResponse(result, state, callback) {
    const { data } = result;
    if (callback) return callback(composeNextState(state, data));
    return composeNextState(state, data);
}

export function request({ username, password }, axiosRequest) {
    const { method, url, params } = axiosRequest;

    console.log(`Sending ${method} request to ${url}`);
    if (params) console.log(` with params:`, params);

    const safeRedirect = ['get', 'head', 'options', 'trace'].includes(
        method.toLowerCase()
    );

    return axios({
        headers: { 'Content-Type': 'application/json' },
        responseType: 'json',
        maxRedirects: safeRedirect ? 5 : 0,
        auth: { username, password },
        paramsSerializer: params => Qs.stringify(params, { arrayFormat: 'repeat' }),
        // Note that providing headers or auth in the request object will overwrite.
        ...axiosRequest,
    });
}

/**
 * Upsert a record. A generic helper function used to atomically either insert a row, or on the basis of the row already existing, UPDATE that existing row instead.
 * @public
 * @function
 * @param {string} resourceType - The type of a resource to `upsert`. E.g. `trackedEntityInstances`
 * @param {Object} query - A query object that allows to uniquely identify the resource to update. If no matches found, then the resource will be created.
 * @param {Object} data - The data to use for update or create depending on the result of the query.
 * @param {{ apiVersion: object, requestConfig: object, params: object }} [options] - Optional configuration that will be applied to both the `get` and the `create` or `update` operations.
 * @param {function} [callback] - Optional callback to handle the response
 * @throws {RangeError} - Throws range error
 * @returns {Operation}
 * @example <caption>Example `expression.js` of upsert</caption>
 * upsert('trackedEntityInstances', {
 *  ou: 'TSyzvBiovKh',
 *  filter: ['w75KJ2mc4zz:Eq:Qassim'],
 * }, {
 *  orgUnit: 'TSyzvBiovKh',
 *  trackedEntityType: 'nEenWmSyUEp',
 *  attributes: [
 *    {
 *      attribute: 'w75KJ2mc4zz',
 *      value: 'Qassim',
 *    },
 *  ],
 * });
 */
export function upsert(
    resourceType,
    query,
    data,
    options = {},
    callback = false
) {
    return state => {
        console.log(`Preparing upsert via 'get' then 'create' OR 'update'...`);

        return get(
            resourceType,
            query,
            options
        )(state)
            .then(resp => {
                const resources = resp.data[resourceType];
                if (resources.length > 1) {
                    throw new RangeError(
                        `Cannot upsert on Non-unique attribute. The operation found ${resources.length} ${resourceType} matching the given attributes.`
                    );
                }

                if (resources.length === 1) {
                    return update(
                        resourceType,
                        resources[0].id,
                        data,
                        options,
                        callback
                    )(state);
                } else {
                    return create(resourceType, data, options, callback)(state);
                }
            })
            .catch(error => {
                console.error(`Error during upsert: ${error.message}`);
                return Promise.reject(error);
            });
    };
}
