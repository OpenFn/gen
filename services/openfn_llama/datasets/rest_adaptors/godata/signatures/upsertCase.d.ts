/**
 * Upsert case to godata using an external id to mach a specific record
 * @public
 * @example
 *  upsertCase("4dce-3eedce3-rd33", 'visualId',
 *    data: state => {
 *      const patient = state.data.body;
 *       return {
 *         firstName: patient.Patient_name.split(' ')[0],
 *         lastName: patient.Patient_name.split(' ')[1],
 *         visualId: patient.Case_ID,
 *         'age:years': patient.Age_in_year,
 *         gender: patient.Sex,
 *       };
 *  })
 * @function
 * @param {string} id - Outbreak id
 * @param {string} externalId - External Id to match
 * @param {object} goDataCase - an object with some case data.
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function upsertCase(id: string, externalId: string, goDataCase: object, callback: Function): Operation;
