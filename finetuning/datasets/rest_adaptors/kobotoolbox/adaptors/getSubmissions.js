import {
  composeNextState,
  expandReferences,
  http,
} from '@openfn/language-common';

/**
 * Get submissions for a specific form
 * @example
 * getSubmissions({formId: 'aXecHjmbATuF6iGFmvBLBX'}, state => {
 *   console.log(state.data);
 *   return state;
 * });
 * @function
 * @param {object} params - Form Id and data to make the fetch or filter
 * @param {function} callback - (Optional) Callback function to execute after fetching form submissions
 * @returns {Operation}
 */
export function getSubmissions(params, callback) {
  return state => {
    const resolvedParams = expandReferences(params)(state);

    const { baseURL, apiVersion, username, password } = state.configuration;
    const { formId } = resolvedParams;

    const url = `${baseURL}/api/${apiVersion}/assets/${formId}/data/?format=json`;
    const auth = { username, password };

    const config = {
      url,
      params: resolvedParams.query,
      auth,
    };

    return http
      .get(config)(state)
      .then(response => {
        console.log('✓', response.data.count, 'submissions fetched.');

        const nextState = composeNextState(state, response.data);
        if (callback) return callback(nextState);
        return nextState;
      });
  };
}