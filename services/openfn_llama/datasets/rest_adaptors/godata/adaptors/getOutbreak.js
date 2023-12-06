import {
    composeNextState,
} from '@openfn/language-common';
import axios from 'axios';

/**
 * Get one or multiple outbreaks from a query filter
 * @public
 * @example
 *  getOutbreak({"where":{"name": "Outbreak demo"}}, state => {
 *    console.log(state.data);
 *    return state;
 *  });
 * @function
 * @param {object} query - An object with a query filter parameter
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function getOutbreak(query, callback) {
    return state => {
        const { apiUrl, access_token } = state.configuration;

        const filter = JSON.stringify(query);

        return axios({
            method: 'GET',
            baseURL: apiUrl,
            url: '/outbreaks',
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