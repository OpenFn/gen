import axios from 'axios';
import Qs from 'qs';
import { expandReferences } from '@openfn/language-common';

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
 * Get data. Generic helper method for getting data of any kind from DHIS2.
 * - This can be used to get `DataValueSets`,`events`,`trackedEntityInstances`,`etc.`
 * @public
 * @function
 * @param {string} resourceType - The type of resource to get(use its `plural` name). E.g. `dataElements`, `trackedEntityInstances`,`organisationUnits`, etc.
 * @param {Object} query - A query object that will limit what resources are retrieved when converted into request params.
 * @param {Object} [options] - Optional `options` to define URL parameters via params beyond filters, request configuration (e.g. `auth`) and DHIS2 api version to use.
 * @param {function} [callback]  - Optional callback to handle the response
 * @returns {Operation} state
 * @example <caption>all data values for the 'pBOMPrpg1QX' dataset</caption>
 * get('dataValueSets', {
 *   dataSet: 'pBOMPrpg1QX',
 *   orgUnit: 'DiszpKrYNg8',
 *   period: '201401',
 *   fields: '*',
 * });
 * @example <caption>all programs for an organization unit</caption>
 * get('programs', { orgUnit: 'TSyzvBiovKh', fields: '*' });
 * @example <caption>a single tracked entity instance by a unique external ID</caption>
 * get('trackedEntityInstances', {
 *   ou: 'DiszpKrYNg8',
 *   filter: ['flGbXLXCrEo:Eq:124', 'w75KJ2mc4zz:Eq:John'],
 * });
 */
export function get(resourceType, query, options = {}, callback = false) {
    return state => {
        console.log('Preparing get operation...');

        const resolvedResourceType = expandReferences(resourceType)(state);
        const resolvedQuery = expandReferences(query)(state);
        const resolvedOptions = expandReferences(options)(state);

        const { params, requestConfig } = resolvedOptions;
        const { configuration } = state;

        return request(configuration, {
            method: 'get',
            url: generateUrl(configuration, resolvedOptions, resolvedResourceType),
            params: { ...resolvedQuery, ...params },
            responseType: 'json',
            ...requestConfig,
        }).then(result => {
            console.log(`Retrieved ${resolvedResourceType}`);
            return handleResponse(result, state, callback);
        });
    };
}
