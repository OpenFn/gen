import {
  expandReferences,
  composeNextState,
} from '@openfn/language-common';

let agent = null;
/**
 * Logs in to OpenMRS, gets a session token.
 * Agent used in main function
 * @example
 *  login(state)
 * @private
 * @param {State} state - Runtime state.
 * @returns {State}
 */
async function login(state) {
  const { instanceUrl, username, password } = state.configuration;
  agent = request.agent();
  await agent.get(`${instanceUrl}/ws/rest/v1/session`).auth(username, password);

  return state;
}

export const Log = {
  success: message => console.log(`✓ Success at ${new Date()}:\n∟ ${message}`),
  warn: message => console.log(`⚠ Warning at ${new Date()}:\n∟ ${message}`),
  error: message => console.log(`✗ Error at ${new Date()}:\n∟ ${message}`),
  info: message => console.log(`ℹ Info at ${new Date()}:\n∟ ${message}`),
};

export function handleError(error) {
  if (error.response) {
    const { method, path } = error.response.req;
    const { status } = error.response;
    if (Object.keys(error.response.body).length === 0) {
      throw new Error(
        `Server responded with:  \n${JSON.stringify(error.response, null, 2)}`
      );
    }

    const errorString = [
      `Request: ${method} ${path}`,
      `Got: ${status}`,
      'Body:',
      JSON.stringify(error.response.body, null, 2),
    ].join('\n');

    throw new Error(errorString);
  } else {
    throw error;
  }
}

export function handleResponse(response, state, callback) {
  const { body } = response;
  const nextState = composeNextState(state, { body });
  if (callback) return callback(nextState);
  return nextState;
}

/**
 * Gets encounters matching params
 * @example
 * getEncounters({patient: "123", fromdate: "2023-05-18"})
 * @function
 * @param {object} query - Object for the patient
 * @param {function} [callback] - Optional callback to handle the response
 * @returns {Operation}
 */
export function getEncounters(query, callback = false) {
  return state => {
    const qs = expandReferences(query)(state);
    const { instanceUrl } = state.configuration;
    const url = `${instanceUrl}/ws/rest/v1/encounter`;

    Log.info(`Searching for encounters: ${JSON.stringify(qs, null, 2)}`);

    return agent
      .get(url)
      .accept('json')
      .query(qs)
      .then(response => {
        Log.success(`Found an encounter.`);

        return handleResponse(response, state, callback);
      })
      .catch(handleError);
  };
}