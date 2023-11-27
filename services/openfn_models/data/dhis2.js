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