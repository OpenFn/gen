/**
 * Get cases from Primero
 *
 * Use this function to get cases from Primero based on a set of query parameters.
 * Note that in many implementations, the `remote` attribute should be set to `true` to ensure that only cases marked for remote access will be retrieved.
 * You can specify a `case_id` value to fetch a unique case and a query string to filter result.
 * @public
 * @example <caption> Get cases from Primero with query parameters</caption>
 * getCases({
 *   remote: true,
 *   query: "sex=male",
 * });
 * @example <caption>Get case from Primero for a specific case id</caption>
 * getCases({
 *   remote: true,
 *   case_id: "6aeaa66a-5a92-4ff5-bf7a-e59cde07eaaz",
 * });
 * @function
 * @param {object} query - an object with a query param at minimum, option to getReferrals
 * @param {object} options - (Optional) an object with a getReferrals key to fetch referrals
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function getCases(query: object, options: object, callback: Function): Operation;
