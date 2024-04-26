import {
  composeNextState,
  expandReferences,
  http,
} from '@openfn/language-common';

/**
 * Sends a message to a list of contacts and/or URNs
 * @public
 * @example
 * sendBroadcast({
 *   text: "Hello world",
 *   urns: ["twitter:sirmixalot"],
 *   contacts: ["a052b00c-15b3-48e6-9771-edbaa277a353"]
 * });
 * @function
 * @param {object} params - data to create the new resource
 * @param {function} callback - (Optional) callback function
 * @returns {Operation}
 */
export function sendBroadcast(params, callback) {
  return state => {
    const resolvedParams = expandReferences(params)(state);

    const { host, apiVersion, token } = state.configuration;

    const url = `${host}/api/${apiVersion || 'v2'}/broadcasts.json`;

    const config = {
      url,
      data: resolvedParams,
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    };

    return http
      .post(config)(state)
      .catch(error => {
        console.log(error.response);
        throw 'That was an error from RapidPro.';
      })
      .then(response => {
        console.log('Broadcast queued:', response.data);
        const nextState = {
          ...composeNextState(state, response.data),
          response,
        };
        if (callback) return callback(nextState);
        return nextState;
      });
  };
}