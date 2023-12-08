/**
 * Get forms from Primero
 *
 * Use this function to get forms from Primero that are accessible to this user based on a set of query parameters.
 * The user can filter the form list by record type and module.
 * @public
 * @example <caption>Get the list of all forms</caption>
 * getForms();
 *
 * @example <caption>Get the list of all forms for a specific module</caption>
 * getForms({
 *   module_id: "6aeaa66a-5a92-4ff5-bf7a-e59cde07eaaz",
 * });
 * @function
 * @param {object} query - an object with a query param at minimum
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function getForms(query: object, callback: Function): Operation;
