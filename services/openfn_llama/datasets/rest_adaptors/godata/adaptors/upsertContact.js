import {
    composeNextState,
    expandReferences,
} from '@openfn/language-common';
import axios from 'axios';

/**
 * Upsert contact to godata using an external id to match a specific record.
 * @public
 * @example
 *  upsertContact("4dce-3eedce3-rd33", 'visualId',
 *    {
 *      firstName: 'Luca',
 *      gender: 'male',
 *      'age:years': '20'
 *      ...
 *    }
 *  )
 * @function
 * @param {string} id - Outbreak id
 * @param {string} externalId - External Id to match
 * @param {object} goDataContact - an object with some case data.
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function upsertContact(id, externalId, goDataContact, callback) {
    return state => {
        const { apiUrl, access_token } = state.configuration;

        const data = expandReferences(goDataContact)(state);

        const query = { where: {} };
        query.where[externalId] = data[externalId];

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
                if (response.data.length > 1) {
                    console.log('Multiple contacts found. Aborting upsert.');
                    console.log(response.data.length, 'contacts');
                } else if (response.data.length === 1) {
                    console.log('Contact found. Performing update.');
                    const contactId = response.data[0].id;
                    return axios({
                        method: 'PUT',
                        baseURL: apiUrl,
                        url: `/outbreaks/${id}/contacts/${contactId}`,
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
                    console.log('No contact found. Performing create.');
                    return axios({
                        method: 'POST',
                        baseURL: apiUrl,
                        url: `/outbreaks/${id}/contacts/`,
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