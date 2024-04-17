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

export function nestArray(data, key) {
    return isArray(data) ? { [key]: data } : data;
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
 * Create a record
 * @public
 * @function
 * @param {string} resourceType - Type of resource to create. E.g. `trackedEntityInstances`, `programs`, `events`, ...
 * @magic resourceType $.children.resourceTypes[*]
 * @param {Dhis2Data} data - Object which defines data that will be used to create a given instance of resource. To create a single instance of a resource, `data` must be a javascript object, and to create multiple instances of a resources, `data` must be an array of javascript objects.
 * @param {Object} [options] - Optional `options` to define URL parameters via params (E.g. `filter`, `dimension` and other import parameters), request config (E.g. `auth`) and the DHIS2 apiVersion.
 * @param {function} [callback] - Optional callback to handle the response
 * @returns {Operation}
 * @example <caption>a program</caption>
 * create('programs', {
 *   name: 'name 20',
 *   shortName: 'n20',
 *   programType: 'WITHOUT_REGISTRATION',
 * });
 * @example <caption>an event</caption>
 * create('events', {
 *   program: 'eBAyeGv0exc',
 *   orgUnit: 'DiszpKrYNg8',
 *   status: 'COMPLETED',
 * });
 * @example <caption>a dataSet</caption>
 * create('dataSets', { name: 'OpenFn Data Set', periodType: 'Monthly' });
 * @example <caption>a dataElement</caption>
 * create('dataElements', {
 *   aggregationType: 'SUM',
 *   domainType: 'AGGREGATE',
 *   valueType: 'NUMBER',
 *   name: 'Paracetamol',
 *   shortName: 'Para',
 * });
 * @example <caption>a dataElementGroup</caption>
 * create('dataElementGroups', {
 *   name: 'Data Element Group 1',
 *   dataElements: [],
 * });
 * @example <caption>a dataValueSet</caption>
 * create('dataValueSets', {
 *   dataElement: 'f7n9E0hX8qk',
 *   period: '201401',
 *   orgUnit: 'DiszpKrYNg8',
 *   value: '12',
 * });
 * @example <caption>an enrollment</caption>
 * create('enrollments', {
 *   trackedEntityInstance: 'bmshzEacgxa',
 *   orgUnit: 'TSyzvBiovKh',
 *   program: 'gZBxv9Ujxg0',
 *   enrollmentDate: '2013-09-17',
 *   incidentDate: '2013-09-17',
 * });
 */
export function create(resourceType, data, options = {}, callback = false) {
    return state => {
        console.log(`Preparing create operation...`);

        const resolvedResourceType = expandReferences(resourceType)(state);
        const resolvedData = expandReferences(data)(state);
        const resolvedOptions = expandReferences(options)(state);

        const { params, requestConfig } = resolvedOptions;
        const { configuration } = state;

        return request(configuration, {
            method: 'post',
            url: generateUrl(configuration, resolvedOptions, resolvedResourceType),
            params,
            data: nestArray(resolvedData, resolvedResourceType),
            ...requestConfig,
        }).then(result => {
            const details = `with response ${JSON.stringify(result.data, null, 2)}`;
            console.log(`Created ${resolvedResourceType} ${details}`);

            const { location } = result.headers;
            if (location) console.log(`Record available @ ${location}`);

            return handleResponse(result, state, callback);
        });
    };
}
