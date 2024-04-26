/**
 * Get one or multiple contacts within an outbreak from a query filter
 * @public
 * @example
 *  getContact("343d-dc3e", {"where":{"firstName": "Luca"}}, state => {
 *    console.log(state.data);
 *    return state;
 *  });
 * @function
 * @param {string} id - Outbreak id
 * @param {object} query - An object with a query filter parameter
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function getContact(id: string, query: object, callback: Function): Operation;
