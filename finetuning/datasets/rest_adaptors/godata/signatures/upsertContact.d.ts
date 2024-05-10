/**
 * Upsert contact to godata using an external id to match a specific record.
 * @public
 * @example
 *  upsertContact("4dce-3eedce3-rd33", 'visualId',
 *    {
 *      firstName: 'Luca',
 *      gender: 'male',
 *      'age:years': '20'
 *      ...
 *    }
 *  )
 * @function
 * @param {string} id - Outbreak id
 * @param {string} externalId - External Id to match
 * @param {object} goDataContact - an object with some case data.
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function upsertContact(id: string, externalId: string, goDataContact: object, callback: Function): Operation;
