import {
    composeNextState,
} from '@openfn/language-common';
import axios from 'axios';

/**
 * Fetch the list of reference data
 * @public
 * @example
 *  listReferenceData(state => {
 *    console.log(state.data);
 *    return state;
 *  });
 * @function
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function listReferenceData(callback) {
    return state => {
        const { apiUrl, access_token } = state.configuration;

        return axios({
            method: 'GET',
            baseURL: apiUrl,
            url: '/reference-data',
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