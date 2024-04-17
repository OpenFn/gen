/**
 * Upsert a record. A generic helper function used to atomically either insert a row, or on the basis of the row already existing, UPDATE that existing row instead.
 * @public
 * @function
 * @param {string} resourceType - The type of a resource to `upsert`. E.g. `trackedEntityInstances`
 * @param {Object} query - A query object that allows to uniquely identify the resource to update. If no matches found, then the resource will be created.
 * @param {Object} data - The data to use for update or create depending on the result of the query.
 * @param {function} [callback] - Optional callback to handle the response
 * @throws {RangeError} - Throws range error
 * @returns {Operation}
 * @example <caption>For an existing patient using upsert</caption>
 * upsert('patient', { q: '10007JJ' }, { person: { age: 50 } });
 * @example <caption>For non existing patient creating a patient record using upsert </caption>
 * upsert(
 *   "patient",
 *   { q: "1000EHE" },
 *   {
 *     identifiers: [
 *       {
 *         identifier: "1000EHE",
 *         identifierType: "05a29f94-c0ed-11e2-94be-8c13b969e334",
 *         location: "44c3efb0-2583-4c80-a79e-1f756a03c0a1",
 *         preferred: true,
 *       },
 *     ],
 *     person: {
 *       gender: "M",
 *       age: 42,
 *     },
 *   }
 * );
 */
export function upsert(resourceType: string, query: any, data: any, callback?: Function): Operation;
