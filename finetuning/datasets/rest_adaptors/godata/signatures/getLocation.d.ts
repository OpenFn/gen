/**
 * Get one or multiple locations from a query filter
 * @public
 * @example
 *  getLocation({"where":{"name": "30 DE OCTUBRE"}}, state => {
 *    console.log(state.data);
 *    return state;
 *  });
 * @function
 * @param {object} query - An object with a query filter parameter
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function getLocation(query: object, callback: Function): Operation;
