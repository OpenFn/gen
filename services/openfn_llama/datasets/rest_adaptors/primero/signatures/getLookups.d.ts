/**
 * Get lookups from Primero
 *
 * Use this function to get a paginated list of all lookups that are accessible to this user from Primero.
 * Note: You can specify a `per` value to fetch records per page(Defaults to 20).
 * Also you can specify `page` value to fetch pagination (Defaults to 1)
 * @public
 * @example <caption>Get lookups from Primero with query parameters</caption>
 * getLookups({
 *   per: 10000,
 *   page: 5
 * });
 * @function
 * @param {object} query - an object with a query param at minimum
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function getLookups(query: object, callback: Function): Operation;
