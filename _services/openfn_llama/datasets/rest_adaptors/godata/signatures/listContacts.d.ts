/**
 * Fetch the list of contacts within a particular outbreak using its ID.
 * @public
 * @example
 *  listContacts("343d-dc3e", // Outbreak Id
 *    state => {
 *       console.log(state);
 *    return state;
 *  });
 * @function
 * @param {string} id - Outbreak id
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function listContacts(id: string, callback: Function): Operation;
