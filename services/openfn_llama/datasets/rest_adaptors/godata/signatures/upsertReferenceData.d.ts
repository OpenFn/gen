/**
 * Upsert reference data to godata
 * @public
 * @example
 *  upsertReferenceData('id', {...})
 * @function
 * @param {string} externalId - External Id to match
 * @param {object} goDataReferenceData - an object with some reference data.
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function upsertReferenceData(externalId: string, goDataReferenceData: object, callback: Function): Operation;
