import {
    composeNextState,
} from '@openfn/language-common';
import axios from 'axios';

/**
 * Get one or multiple contacts within an outbreak from a query filter
 * @public
 * @example
 *  getContact("343d-dc3e", {"where":{"firstName": "Luca"}}, state => {
 *    console.log(state.data);
 *    return state;
 *  });
 * @function
 * @param {string} id - Outbreak id
 * @param {object} query - An object with a query filter parameter
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function getContact(id, query, callback) {
    return state => {
        const { apiUrl, access_token } = state.configuration;

        const filter = JSON.stringify(query);

        return axios({
            baseURL: apiUrl,
            url: `/outbreaks/${id}/contacts`,
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