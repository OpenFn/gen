import {
  composeNextState,
  expandReferences,
  http,
} from '@openfn/language-common';

/**
 * Get deployment information for a specific form
 * @example
 * getDeploymentInfo({formId: 'aXecHjmbATuF6iGFmvBLBX'}, state => {
 *   console.log(state.data);
 *   return state;
 * });
 * @function
 * @param {object} params - Form Id and data to make the fetch or filter
 * @param {function} callback - (Optional) Callback function to execute after fetching form deployment information
 * @returns {Operation}
 */
export function getDeploymentInfo(params, callback) {
  return state => {
    const resolvedParams = expandReferences(params)(state);

    const { baseURL, apiVersion, username, password } = state.configuration;
    const { formId } = resolvedParams;

    const url = `${baseURL}/api/${apiVersion}/assets/${formId}/deployment/?format=json`;
    const auth = { username, password };

    const config = {
      url,
      params: resolvedParams.query,
      auth,
    };

    return http
      .get(config)(state)
      .then(response => {
        console.log('✓', 'deployment information fetched.');

        const nextState = composeNextState(state, response.data);
        if (callback) return callback(nextState);
        return nextState;
      });
  };
}