/**
 * Start a RapidPro flow for a number of contacts
 * @public
 * @example
 * startFlow({
 *   flow: "f5901b62-ba76-4003-9c62-72fdacc1b7b7",
 *   restart_participants: false,
 *   contacts: ["a052b00c-15b3-48e6-9771-edbaa277a353"]
 * });
 * @function
 * @param {object} params - data to create the new resource
 * @param {function} callback - (Optional) callback function
 * @returns {Operation}
 */
export function startFlow(params: object, callback: Function): Operation;
