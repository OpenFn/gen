/**
 * Upsert location to godata
 * @public
 * @example
 *  upsertLocation('name', {...})
 * @function
 * @param {string} externalId - External Id to match
 * @param {object} goDataLocation - an object with some location data.
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function upsertLocation(externalId: string, goDataLocation: object, callback: Function): Operation;
