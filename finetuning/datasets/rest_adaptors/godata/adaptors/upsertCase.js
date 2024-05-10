import {
    composeNextState,
    expandReferences,
} from '@openfn/language-common';
import axios from 'axios';

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
export function upsertCase(id, externalId, goDataCase, callback) {
    return state => {
        const { apiUrl, access_token } = state.configuration;

        const data = expandReferences(goDataCase)(state);

        const query = { where: {} };
        query.where[externalId] = data[externalId];

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
                if (response.data.length > 1) {
                    console.log(response.data.length, 'cases found; aborting upsert.');
                } else if (response.data.length === 1) {
                    console.log('Case found. Performing update.');
                    const caseId = response.data[0].id;
                    data['id'] = caseId;
                    delete data.visualId;
                    return axios({
                        method: 'PUT',
                        baseURL: apiUrl,
                        url: `/outbreaks/${id}/cases/${caseId}`,
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
                    console.log('No case found. Performing create.');
                    return axios({
                        method: 'POST',
                        baseURL: apiUrl,
                        url: `/outbreaks/${id}/cases/`,
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