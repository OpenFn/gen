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
 * Upsert a record. A generic helper function used to automically either insert a row, or on the basis of the row already existing, UPDATE that existing row instead.
 * @public
 * @function
 * @param {string} resourceType - The type of a resource to `upsert`. E.g. `trackedEntityInstances`
 * @param {Object} query - A query object that allows to uniquely identify the resource to update. If no matches found, then the resource will be created.
 * @param {Object} data - The data to use for update or create depending on the result of the query.
 * @param {function} [callback] - Optional callback to handle the response
 * @throws {RangeError} - Throws range error
 * @returns {Operation}
 * @example <caption>For an existing patient using upsert</caption>
 * upsert('patient', { q: '10007JJ' }, { person: { age: 50 } });
 * @example <caption>For non existing patient creating a patient record using upsert </caption>
 * upsert(
 *   "patient",
 *   { q: "1000EHE" },
 *   {
 *     identifiers: [
 *       {
 *         identifier: "1000EHE",
 *         identifierType: "05a29f94-c0ed-11e2-94be-8c13b969e334",
 *         location: "44c3efb0-2583-4c80-a79e-1f756a03c0a1",
 *         preferred: true,
 *       },
 *     ],
 *     person: {
 *       gender: "M",
 *       age: 42,
 *     },
 *   }
 * );
 */
export function upsert(
  resourceType, // resourceType supplied to both the `get` and the `create/update`
  query, // query supplied to the `get`
  data, // data supplied to the `create/update`
  callback = false // callback for the upsert itself.
) {
  return state => {
    Log.info(`Preparing upsert via 'get' then 'create' OR 'update'...`);

    return get(
      resourceType,
      query
    )(state)
      .then(resp => {
        const resources = resp.data.body.results;
        if (resources.length > 1) {
          throw new RangeError(
            `Cannot upsert on Non-unique attribute. The operation found more than one records for your request.`
          );
        } else if (resources.length <= 0) {
          return create(resourceType, data)(state);
        } else {
          // Pick out the first (and only) resource in the array and grab its
          // ID to be used in the subsequent `update` by the path determined
          const path = resources[0]['uuid'];
          return update(resourceType, path, data)(state);
        }
      })
      .then(result => {
        Log.success(`Performed a "composed upsert" on ${resourceType}`);
        return handleResponse(result, state, callback);
      });
  };
}