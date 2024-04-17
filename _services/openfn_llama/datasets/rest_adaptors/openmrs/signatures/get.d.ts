/**
 * Make a get request to any OpenMRS endpoint
 * @example
 * get("patient", {
 *   q: "Patient",
 *   limit: 1,
 * });
 * @function
 * @param {string} path - Path to resource
 * @param {object} query - parameters for the request
 * @param {function} [callback] - Optional callback to handle the response
 * @returns {Operation}
 */
export function get(path: string, query: object, callback?: Function): Operation;
