/**
 * Upsert outbreak to godata
 * @public
 * @example
 *  upsertOutbreak({externalId: "3dec33-ede3", data: {...}})
 * @function
 * @param {object} outbreak - an object with an externalId and some outbreak data.
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function upsertOutbreak(outbreak: object, callback: Function): Operation;
