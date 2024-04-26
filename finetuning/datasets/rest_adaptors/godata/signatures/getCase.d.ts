/**
 * Get one or multiple cases within an outbreak from a query filter
 * @public
 * @example
 * getCase(
 *    '3b55-cdf4',
 *    { 'where.relationship': { active: true }, where: { firstName: 'Luca'} },
 *    state => {
 *      console.log(state);
 *      return state;
 *    }
 * );
 * @function
 * @param {string} id - Outbreak id
 * @param {object} query - An object with a query filter parameter
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function getCase(id: string, query: object, callback: Function): Operation;
