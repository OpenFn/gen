/**
 * Upserts a contact to RapidPro by URN
 * @public
 * @example
 * upsertContact({
 *   name: "Mamadou",
 *   language: "ENG",
 *   urns: ["tel:+250788123123"]
 * });
 * @function
 * @param {object} params - data to upsert a contact
 * @param {function} callback - (Optional) callback function
 * @returns {Operation}
 */
export function upsertContact(params: object, callback: Function): Operation;
