/**
 * Get submissions for a specific form
 * @example
 * getSubmissions({formId: 'aXecHjmbATuF6iGFmvBLBX'}, state => {
 *   console.log(state.data);
 *   return state;
 * });
 * @function
 * @param {object} params - Form Id and data to make the fetch or filter
 * @param {function} callback - (Optional) Callback function to execute after fetching form submissions
 * @returns {Operation}
 */
export function getSubmissions(params: object, callback: Function): Operation;
