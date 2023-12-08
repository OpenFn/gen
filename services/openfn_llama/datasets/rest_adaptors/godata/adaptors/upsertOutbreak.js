import {
    composeNextState,
    expandReferences,
} from '@openfn/language-common';
import axios from 'axios';

/**
 * Upsert outbreak to godata
 * @public
 * @example
 *  upsertOutbreak({externalId: "3dec33-ede3", data: {...}})
 * @function
 * @param {object} outbreak - an object with an externalId and some outbreak data.
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function upsertOutbreak(outbreak, callback) {
    return state => {
        const { apiUrl, access_token } = state.configuration;

        const { externalId, data } = expandReferences(outbreak)(state);

        const filter = JSON.stringify({ where: { id: externalId } });

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
                if (response.data.length > 0) {
                    console.log('Outbreak found. Performing update.');
                    const outbreakId = response.data[0].id;
                    return axios({
                        method: 'PUT',
                        baseURL: apiUrl,
                        url: `/outbreaks/${outbreakId}`,
                        params: {
                            access_token,
                        },
                        data,
                    })
                        .then(response => {
                            const nextState = composeNextState(state, response.data);
                            if (callback) return callback(nextState);
                            return nextState;
                        })
                        .catch(error => {
                            return error;
                        });
                } else {
                    console.log('No outbreak found. Performing create.');
                    return axios({
                        method: 'POST',
                        baseURL: apiUrl,
                        url: '/outbreaks',
                        params: {
                            access_token,
                        },
                        data,
                    })
                        .then(response => {
                            const nextState = composeNextState(state, response.data);
                            if (callback) return callback(nextState);
                            return nextState;
                        })
                        .catch(error => {
                            return error;
                        });
                }
            })
            .catch(error => {
                return error;
            });
    };
}