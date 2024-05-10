import {
    composeNextState,
    expandReferences,
} from '@openfn/language-common';
import axios from 'axios';

/**
 * Upsert location to godata
 * @public
 * @example
 *  upsertLocation('name', {...})
 * @function
 * @param {string} externalId - External Id to match
 * @param {object} goDataLocation - an object with some location data.
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function upsertLocation(externalId, goDataLocation, callback) {
    return state => {
        const { apiUrl, access_token } = state.configuration;

        const data = expandReferences(goDataLocation)(state);

        const query = { where: {} };
        query.where[externalId] = data[externalId];

        const filter = JSON.stringify(query);

        return axios({
            method: 'GET',
            baseURL: apiUrl,
            url: '/locations',
            params: {
                filter,
                access_token,
            },
        })
            .then(response => {
                if (response.data.length > 1) {
                    console.log(
                        response.data.length,
                        'locations found; aborting upsert.'
                    );
                    return response;
                } else if (response.data.length === 1) {
                    console.log('Location found. Performing update.');
                    const locationId = response.data[0].id;
                    return axios({
                        method: 'PUT',
                        baseURL: apiUrl,
                        url: `/locations/${locationId}`,
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
                    console.log('No location found. Performing create.');
                    return axios({
                        method: 'POST',
                        baseURL: apiUrl,
                        url: '/locations',
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