import {
  composeNextState,
  expandReferences,
  http,
} from '@openfn/language-common';

/**
 * Make a request to get the list of forms
 * @public
 * @example
 * getForms({}, state => {
 *    console.log(state.data);
 *    return state;
 * });
 * @function
 * @param {object} params - Query, Headers and Authentication parameters
 * @param {function} callback - (Optional) Callback function to execute after fetching form list
 * @returns {Operation}
 */
export function getForms(params, callback) {
  return state => {
    const resolvedParams = expandReferences(params)(state);

    const { baseURL, apiVersion, username, password } = state.configuration;

    const url = `${baseURL}/api/${apiVersion}/assets/?format=json`;
    const auth = { username, password };

    const config = {
      url,
      params: resolvedParams,
      auth,
    };

    return http
      .get(config)(state)
      .then(response => {
        console.log('✓', response.data.count, 'forms fetched.');
        const nextState = composeNextState(state, response.data);
        if (callback) return callback(nextState);
        return nextState;
      });
  };
}