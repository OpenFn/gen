import {
  composeNextState,
  expandReferences,
  http,
} from '@openfn/language-common';

/**
 * Start a RapidPro flow for a number of contacts
 * @public
 * @example
 * startFlow({
 *   flow: "f5901b62-ba76-4003-9c62-72fdacc1b7b7",
 *   restart_participants: false,
 *   contacts: ["a052b00c-15b3-48e6-9771-edbaa277a353"]
 * });
 * @function
 * @param {object} params - data to create the new resource
 * @param {function} callback - (Optional) callback function
 * @returns {Operation}
 */
export function startFlow(params, callback) {
  return state => {
    const resolvedParams = expandReferences(params)(state);

    const { host, apiVersion, token } = state.configuration;

    const url = `${host}/api/${apiVersion || 'v2'}/flow_starts.json`;

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
        console.log('Flow started:', response.data);
        const nextState = {
          ...composeNextState(state, response.data),
          response,
        };
        if (callback) return callback(nextState);
        return nextState;
      });
  };
}