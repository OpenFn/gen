import {
  expandReferences,
} from '@openfn/language-common';
import request from 'request';

export function scrubResponse(response) {
  if (response) response.request.headers.Authorization = '--REDACTED--';

  return response;
}

export function assembleError({ response, error, params }) {
  if (response) {
    const customCodes = params.options && params.options.successCodes;
    if ((customCodes || [200, 201, 202, 204]).indexOf(response.statusCode) > -1)
      return false;
  }

  if (error) return error;

  return new Error(
    `Server responded with:\n${JSON.stringify(response, null, 2)}`
  );
}

export function tryJson(data) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return { body: data };
  }
}

const composeNextState = (state, data, meta) => {
  const nextState = {
    ...state,
    data,
    references: [...state.references, state.data],
  };

  if (meta) {
    return { ...nextState, metadata: meta };
  }
  return nextState;
};

/**
 * Get lookups from Primero
 *
 * Use this function to get a paginated list of all lookups that are accessible to this user from Primero.
 * Note: You can specify a `per` value to fetch records per page(Defaults to 20).
 * Also you can specify `page` value to fetch pagination (Defaults to 1)
 * @public
 * @example <caption>Get lookups from Primero with query parameters</caption>
 * getLookups({
 *   per: 10000,
 *   page: 5
 * });
 * @function
 * @param {object} query - an object with a query param at minimum
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function getLookups(query, callback) {
  return state => {
    const { auth } = state;
    const { url } = state.configuration;

    const expandedQuery = expandReferences(query)(state);

    const params = {
      method: 'GET',
      url: `${url}/api/v2/lookups`,
      headers: {
        Authorization: auth.token,
        'Content-Type': 'application/json',
      },
      qs: expandedQuery,
    };

    return new Promise((resolve, reject) => {
      request(params, async function (err, resp, body) {
        const response = scrubResponse(resp);
        const error = assembleError({ error: err, response, params });
        if (error) {
          reject(error);
        } else {
          console.log(
            `Primero says: '${response.statusCode} ${response.statusMessage}'`
          );
          const resp = tryJson(body);
          const lookups = resp.data;
          console.log(
            `${lookups.length} lookups retrieved from request: ${JSON.stringify(
              response.request,
              null,
              2
            )}`
          );

          const nextState = composeNextState(state, lookups);
          if (callback) resolve(callback(nextState));
          resolve(nextState);
        }
      });
    });
  };
}