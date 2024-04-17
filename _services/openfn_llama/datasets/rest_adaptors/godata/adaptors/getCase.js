import {
    composeNextState,
} from '@openfn/language-common';
import axios from 'axios';

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
export function getCase(id, query, callback) {
    return state => {
        const { apiUrl, access_token } = state.configuration;

        const filter = JSON.stringify(query);

        return axios({
            baseURL: apiUrl,
            url: `/outbreaks/${id}/cases`,
            method: 'GET',
            params: {
                filter,
                access_token,
            },
        })
            .then(response => {
                const nextState = composeNextState(state, response.data);
                if (callback) return callback(nextState);
                return nextState;
            })
            .catch(error => {
                return error;
            });
    };
}