/**
 * Get locations from Primero
 *
 * Use this function to get a paginated list of all locations that are accessible to this user from Primero.
 * Note: You can specify a `per` value to fetch records per page(Defaults to 20).
 * Also you can specify `page` value to fetch pagination (Defaults to 1).
 * Another parameter is `hierarchy: true` (Defaults to false)
 * @public
 * @example <caption>Get loocations from Primero with query parameters</caption>
 * getLocations({
 *   page: 1,
 *   per: 20
 * })
 * @function
 * @param {object} query - an object with a query param at minimum
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function getLocations(query: object, callback: Function): Operation;
