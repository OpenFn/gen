import {
    composeNextState,
} from '@openfn/language-common';
import axios from 'axios';

/**
 * Get one or multiple reference data from a query filter
 * @public
 * @example
 *  getReferenceData({"where":{"categoryId": "LNG_REFERENCE_DATA_CATEGORY_CENTRE_NAME"}}, state => {
 *    console.log(state.data);
 *    return state;
 *  });
 * @function
 * @param {object} query - An object with a query filter parameter
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function getReferenceData(query, callback) {
    return state => {
        const { apiUrl, access_token } = state.configuration;

        const filter = JSON.stringify(query);

        return axios({
            method: 'GET',
            baseURL: apiUrl,
            url: '/reference-data',
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