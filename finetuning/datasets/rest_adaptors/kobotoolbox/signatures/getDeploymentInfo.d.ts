/**
 * Get deployment information for a specific form
 * @example
 * getDeploymentInfo({formId: 'aXecHjmbATuF6iGFmvBLBX'}, state => {
 *   console.log(state.data);
 *   return state;
 * });
 * @function
 * @param {object} params - Form Id and data to make the fetch or filter
 * @param {function} callback - (Optional) Callback function to execute after fetching form deployment information
 * @returns {Operation}
 */
export function getDeploymentInfo(params: object, callback: Function): Operation;
