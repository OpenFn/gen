/**
 * Fetch all non-retired persons that match any specified parameters
 * @example
 * searchPerson({ q: Sarah })
 * @function
 * @param {object} query - object with query for the person
 * @param {function} [callback] - Optional callback to handle the response
 * @returns {Operation}
 */
export function searchPerson(query: object, callback?: Function): Operation;
