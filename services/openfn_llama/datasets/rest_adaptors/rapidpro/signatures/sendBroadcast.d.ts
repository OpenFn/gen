/**
 * Sends a message to a list of contacts and/or URNs
 * @public
 * @example
 * sendBroadcast({
 *   text: "Hello world",
 *   urns: ["twitter:sirmixalot"],
 *   contacts: ["a052b00c-15b3-48e6-9771-edbaa277a353"]
 * });
 * @function
 * @param {object} params - data to create the new resource
 * @param {function} callback - (Optional) callback function
 * @returns {Operation}
 */
export function sendBroadcast(params: object, callback: Function): Operation;
