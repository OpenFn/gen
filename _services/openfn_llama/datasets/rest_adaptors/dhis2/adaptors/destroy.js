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
 * Delete a record. A generic helper function to delete an object
 * @public
 * @function
 * @param {string} resourceType - The type of resource to be deleted. E.g. `trackedEntityInstances`, `organisationUnits`, etc.
 * @param {string} path - Can be an `id` of an `object` or `path` to the `nested object` to `delete`.
 * @param {Object} [data] - Optional. This is useful when you want to remove multiple objects from a collection in one request. You can send `data` as, for example, `{"identifiableObjects": [{"id": "IDA"}, {"id": "IDB"}, {"id": "IDC"}]}`. See more {@link https://docs.dhis2.org/2.34/en/dhis2_developer_manual/web-api.html#deleting-objects on DHIS2 API docs}
 * @param {{apiVersion: number,operationName: string,resourceType: string}} [options] - Optional `options` for `del` operation including params e.g. `{preheatCache: true, strategy: 'UPDATE', mergeMode: 'REPLACE'}`. Run `discover` or see {@link https://docs.dhis2.org/2.34/en/dhis2_developer_manual/web-api.html#create-update-parameters DHIS2 documentation}. Defaults to `{operationName: 'delete', apiVersion: state.configuration.apiVersion, responseType: 'json'}`
 * @param {function} [callback] - Optional callback to handle the response
 * @returns {Operation}
 * @example <caption>a tracked entity instance</caption>
 * destroy('trackedEntityInstances', 'LcRd6Nyaq7T');
 */
export function destroy(
    resourceType,
    path,
    data = null,
    options = {},
    callback = false
) {
    return state => {
        console.log('Preparing destroy operation...');

        const resolvedResourceType = expandReferences(resourceType)(state);
        const resolvedPath = expandReferences(path)(state);
        const resolvedData = expandReferences(data)(state);
        const resolvedOptions = expandReferences(options)(state);

        const { params, requestConfig } = resolvedOptions;
        const { configuration } = state;

        return request({
            method: 'delete',
            url: generateUrl(
                configuration,
                resolvedOptions,
                resolvedResourceType,
                resolvedPath
            ),
            params,
            resolvedData,
            ...requestConfig,
        }).then(result => {
            console.log(`Deleted ${resolvedResourceType} at ${resolvedPath}`);
            return handleResponse(result, state, callback);
        });
    };
}