import {
    composeNextState,
} from '@openfn/language-common';
import axios from 'axios';

/**
 * Fetch the list of cases within a particular outbreak using its ID.
 * @public
 * @example
 *  listCases("343d-dc3e", state => {
 *    console.log(state);
 *    return state;
 *  });
 * @function
 * @param {string} id - Outbreak id
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function listCases(id, callback) {
    return state => {
        const { apiUrl, access_token } = state.configuration;

        return axios({
            method: 'GET',
            baseURL: apiUrl,
            url: `/outbreaks/${id}/cases`,
            params: {
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