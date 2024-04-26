/**
 * Make a request to get the list of forms
 * @public
 * @example
 * getForms({}, state => {
 *    console.log(state.data);
 *    return state;
 * });
 * @function
 * @param {object} params - Query, Headers and Authentication parameters
 * @param {function} callback - (Optional) Callback function to execute after fetching form list
 * @returns {Operation}
 */
export function getForms(params: object, callback: Function): Operation;
