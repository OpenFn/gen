/**
 * Update a single referral for a specific case in Primero
 * @public
 * @example <caption>Update referral by record id</caption>
 * updateReferral({
 *   caseExternalId: "record_id",
 *   id: "749e9c6e-60db-45ec-8f5a-69da7c223a79",
 *   caseId: "dcea6052-07d9-4cfa-9abf-9a36987cdd25",
 *   data: (state) => state.data,
 * });
 * @function
 * @param {object} params - an object with an caseExternalId value to use, the id and the referral id to update.
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function updateReferral(params: object, callback: Function): Operation;
