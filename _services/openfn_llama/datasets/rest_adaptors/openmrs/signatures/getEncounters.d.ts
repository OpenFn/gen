/**
 * Gets encounters matching params
 * @example
 * getEncounters({patient: "123", fromdate: "2023-05-18"})
 * @function
 * @param {object} query - Object for the patient
 * @param {function} [callback] - Optional callback to handle the response
 * @returns {Operation}
 */
export function getEncounters(query: object, callback?: Function): Operation;
