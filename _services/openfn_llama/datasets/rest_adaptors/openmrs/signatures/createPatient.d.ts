/**
 * Creates a new patient
 * @example
 * createPatient({
 *   identifiers: [
 *     {
 *       identifier: '4023287',
 *       identifierType: '05a29f94-c0ed-11e2-94be-8c13b969e334',
 *       preferred: true,
 *     },
 *   ],
 *   person: {
 *     gender: 'M',
 *     age: 42,
 *     birthdate: '1970-01-01T00:00:00.000+0100',
 *     birthdateEstimated: false,
 *     names: [
 *       {
 *         givenName: 'Doe',
 *         familyName: 'John',
 *       },
 *     ],
 *   },
 * })
 * @function
 * @param {object} data - Object parameters of the patient
 * @param {function} [callback] - Optional callback to handle the response
 * @returns {Operation}
 */
export function createPatient(data: object, callback?: Function): Operation;
