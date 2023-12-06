/**
 * Get referrals for a specific case in Primero
 *
 * Use this function to get the list of referrals of one case from Primero.
 * The search can be done using either `record id` or `case id`.
 * @public
 * @example <caption>Get referrals for a case in Primero by record id</caption>
 * getReferrals({
 *   externalId: "record_id",
 *   id: "6aeaa66a-5a92-4ff5-bf7a-e59cde07eaaz",
 * });
 * @example <caption>Get referrals for a case in Primero by case id</caption>
 *  getReferrals({
 *   id: "6aeaa66a-5a92-4ff5-bf7a-e59cde07eaaz",
 * });
 * @function
 * @param {object} params - an object with an externalId field to select the attribute to use for matching on case and an externalId value for that case.
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function getReferrals(params: object, callback: Function): Operation;
