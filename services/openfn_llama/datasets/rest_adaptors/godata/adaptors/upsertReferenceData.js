import {
    composeNextState,
    expandReferences,
} from '@openfn/language-common';
import axios from 'axios';

/**
 * Upsert reference data to godata
 * @public
 * @example
 *  upsertReferenceData('id', {...})
 * @function
 * @param {string} externalId - External Id to match
 * @param {object} goDataReferenceData - an object with some reference data.
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function upsertReferenceData(externalId, goDataReferenceData, callback) {
    return state => {
        const { apiUrl, access_token } = state.configuration;

        const data = expandReferences(goDataReferenceData)(state);

        const query = { where: {} };
        query.where[externalId] = data[externalId];

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
                if (response.data.length > 1) {
                    console.log(
                        response.data.length,
                        'reference data found; aborting upsert.'
                    );
                    return response;
                } else if (response.data.length === 1) {
                    console.log('Reference data found. Performing update.');
                    const referenceDataId = response.data[0].id;
                    console.log('referenceDataId', referenceDataId);
                    return axios({
                        method: 'PUT',
                        baseURL: apiUrl,
                        url: `/reference-data/${referenceDataId}`,
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
                    console.log('No reference data found. Performing create.');
                    return axios({
                        method: 'POST',
                        baseURL: apiUrl,
                        url: '/reference-data',
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