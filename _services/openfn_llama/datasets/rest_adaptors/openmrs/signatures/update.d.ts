/**
 * Update data. A generic helper function to update a resource object of any type.
 * Updating an object requires to send `all required fields` or the `full body`
 * @public
 * @function
 * @param {string} resourceType - The type of resource to be updated. E.g. `person`, `patient`, etc.
 * @param {string} path - The `id` or `path` to the `object` to be updated. E.g. `e739808f-f166-42ae-aaf3-8b3e8fa13fda` or `e739808f-f166-42ae-aaf3-8b3e8fa13fda/{collection-name}/{object-id}`
 * @param {Object} data - Data to update. It requires to send `all required fields` or the `full body`. If you want `partial updates`, use `patch` operation.
 * @param {function} [callback]  - Optional callback to handle the response
 * @returns {Operation}
 * @example <caption>a person</caption>
 * update("person", '3cad37ad-984d-4c65-a019-3eb120c9c373',{"gender":"M","birthdate":"1997-01-13"})
 */
export function update(resourceType: string, path: string, data: any, callback?: Function): Operation;
