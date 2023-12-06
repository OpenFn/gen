/**
 * Upsert case to Primero
 *
 * Use this function to update an existing case from Primero or to create it otherwise.
 * In this implementation, we first fetch the list of cases,
 * then we check if the case exist before choosing the right operation to do.
 * @public
 * @example <caption>Upsert case for a specific case id</caption>
 * upsertCase({
 *   externalIds: ["case_id"],
 *   data: state => ({
 *     age: 20,
 *     sex: "male",
 *     name: "Alex",
 *     status: "open",
 *     case_id: "6aeaa66a-5a92-4ff5-bf7a-e59cde07eaaz",
 *   }),
 * });
 * @function
 * @param {object} params - an object with an externalIds and some case data.
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function upsertCase(params: object, callback: Function): Operation;
