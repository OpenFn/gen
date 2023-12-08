/**
 * Creates a resource in a destination system on FHIR using a POST request
 * @public
 * @example
 * create("Bundle", {...state.data: type: "collection"})
 * @function
 * @param {string} path - Path to resource
 * @param {object} params - data to create the new resource
 * @param {function} callback - (Optional) callback function
 * @returns {Operation}
 */
export function create(path: string, params: object, callback: Function): Operation;