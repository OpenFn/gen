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

    // NOTE: We don't follow redirects for unsafe methods: https://github.com/axios/axios/issues/2460
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
 * Update data. A generic helper function to update a resource object of any type.
 * Updating an object requires to send `all required fields` or the `full body`
 * @public
 * @function
 * @param {string} resourceType - The type of resource to be updated. E.g. `dataElements`, `organisationUnits`, etc.
 * @param {string} path - The `id` or `path` to the `object` to be updated. E.g. `FTRrcoaog83` or `FTRrcoaog83/{collection-name}/{object-id}`
 * @param {Object} data - Data to update. It requires to send `all required fields` or the `full body`. If you want `partial updates`, use `patch` operation.
 * @param {Object} [options] - Optional `options` to define URL parameters via params (E.g. `filter`, `dimension` and other import parameters), request config (E.g. `auth`) and the DHIS2 apiVersion.
 * @param {function} [callback]  - Optional callback to handle the response
 * @returns {Operation}
 * @example <caption>a program</caption>
 * update('programs', 'qAZJCrNJK8H', {
 *   name: '14e1aa02c3f0a31618e096f2c6d03bed',
 *   shortName: '14e1aa02',
 *   programType: 'WITHOUT_REGISTRATION',
 * });
 * @example <caption>an event</caption>
 * update('events', 'PVqUD2hvU4E', {
 *   program: 'eBAyeGv0exc',
 *   orgUnit: 'Ngelehun CHC',
 *   status: 'COMPLETED',
 *   storedBy: 'admin',
 *   dataValues: [],
 * });
 */
export function update(
    resourceType,
    path,
    data,
    options = {},
    callback = false
) {
    return state => {
        console.log(`Preparing update operation...`);

        const resolvedResourceType = expandReferences(resourceType)(state);
        const resolvedPath = expandReferences(path)(state);
        const resolvedData = expandReferences(data)(state);
        const resolvedOptions = expandReferences(options)(state);

        const { params, requestConfig } = resolvedOptions;
        const { configuration } = state;

        return request(configuration, {
            method: 'put',
            url: generateUrl(
                configuration,
                resolvedOptions,
                resolvedResourceType,
                path
            ),
            params,
            data: resolvedData,
            ...requestConfig,
        }).then(result => {
            console.log(`Updated ${resolvedResourceType} at ${resolvedPath}`);
            return handleResponse(result, state, callback);
        });
    };
}
