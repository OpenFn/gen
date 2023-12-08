/**
 * Create a new case in Primero
 *
 * Use this function to create a new case in Primero based on a set of Data.
 * @public
 * @example <caption>Create a new case in Primero based on a set of Data</caption>
 * createCase({
 *   data: {
 *     age: 16,
 *     sex: "female",
 *     name: "Edwine Edgemont",
 *   },
 * });
 * @function
 * @param {object} params - an object with some case data.
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function createCase(params: object, callback: Function): Operation;
