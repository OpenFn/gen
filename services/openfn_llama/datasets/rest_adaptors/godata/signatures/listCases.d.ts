/**
 * Fetch the list of cases within a particular outbreak using its ID.
 * @public
 * @example
 *  listCases("343d-dc3e", state => {
 *    console.log(state);
 *    return state;
 *  });
 * @function
 * @param {string} id - Outbreak id
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function listCases(id: string, callback: Function): Operation;
