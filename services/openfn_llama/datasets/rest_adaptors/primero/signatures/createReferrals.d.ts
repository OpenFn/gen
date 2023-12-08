/**
 * Create referrals in Primero
 *
 * Use this function to bulk refer to one or multiple cases from Primero to a single user
 * @public
 * @example <caption>Create referrals for multiple cases in Primero</caption>
 * createReferrals({
 *   data: {
 *     ids: [
 *       "749e9c6e-60db-45ec-8f5a-69da7c223a79",
 *       "dcea6052-07d9-4cfa-9abf-9a36987cdd25",
 *     ],
 *     transitioned_to: "primero_cp",
 *     notes: "This is a bulk referral",
 *   },
 * });
 * @function
 * @param {object} params - an object with referral data.
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function createReferrals(params: object, callback: Function): Operation;
