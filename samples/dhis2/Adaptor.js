import {
  expandReferences,
} from '@openfn/language-common';
import axios from 'axios';

/**
 * Creates a new trackedEntityInstance and includes it in the state data.
 * Sends a POST request to the /trackedEntityInstances endpoint.
 * @example
 * createTrackedEntityInstance({name: 'John Doe', age: 25}, callback)
 * @function
 * @param {Object} trackedEntityInstance - The data of the trackedEntityInstance to be created.
 * @param {Function} callback - A callback which is invoked with the resulting state at the end of this operation. Allows users to customize the resulting state. State.data includes the response from the server.
 * @example <caption>Create a new trackedEntityInstance</caption>
 * createTrackedEntityInstance({name: 'John Doe', age: 25})
 * @returns {Function} A function that updates the state with the created trackedEntityInstance.
 */
export function createTrackedEntityInstance(
  trackedEntityInstance,
  callback
) {
  return state => {
    const { apiUrl, apiVersion, apiUsername, apiPassword } = state.configuration;

    const data = expandReferences(trackedEntityInstance)(state);

    const url = `${apiUrl}/api/${apiVersion}/trackedEntityInstances`;

    const config = {
      url,
      method: 'post',
      auth: {
        username: apiUsername,
        password: apiPassword,
      },
      data,
    };

    return axios(config)
      .then(response => {
        const newState = {
          ...state,
          references: [...state.references, response.data],
          data: { ...state.data, response.data },
        };
        if (callback) return callback(newState);
        return newState;
      })
      .catch(error => {
        return error;
      });
  };
}