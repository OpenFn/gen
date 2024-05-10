/**
 * Gets encounter matching a uuid
 * @example
 * getEncounter("123")
 * @function
 * @param {object} uuid - A uuid for the encounter
 * @param {function} [callback] - Optional callback to handle the response
 * @returns {Operation}
 */
export function getEncounter(uuid: object, callback?: Function): Operation;
