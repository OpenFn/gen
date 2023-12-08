/**
 * Update an existing case in Primero
 *
 * Use this function to update an existing case from Primero.
 * In this implementation, the function uses a case ID to check for the case to update,
 * Then merge the values submitted in this call into an existing case.
 * Fields not specified in this request will not be modified.
 * For nested subform fields, the subform arrays will be recursively merged,
 * keeping both the existing values and appending the new
 * @public
 * @example <caption>Update case for a specific case id</caption>
 * updateCase("6aeaa66a-5a92-4ff5-bf7a-e59cde07eaaz", {
 *   data: {
 *     age: 16,
 *     sex: "female",
 *     name: "Fiona Edgemont",
 *   },
 * });
 * @function
 * @param {string} id - A case ID to use for the update.
 * @param {object} params - an object with some case data.
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function updateCase(id: string, params: object, callback: Function): Operation;
