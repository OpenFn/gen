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
 * Get cases from Primero
 *
 * Use this function to get cases from Primero based on a set of query parameters.
 * Note that in many implementations, the `remote` attribute should be set to `true` to ensure that only cases marked for remote access will be retrieved.
 * You can specify a `case_id` value to fetch a unique case and a query string to filter result.
 * @public
 * @example <caption> Get cases from Primero with query parameters</caption>
 * getCases({
 *   remote: true,
 *   query: "sex=male",
 * });
 * @example <caption>Get case from Primero for a specific case id</caption>
 * getCases({
 *   remote: true,
 *   case_id: "6aeaa66a-5a92-4ff5-bf7a-e59cde07eaaz",
 * });
 * @function
 * @param {object} query - an object with a query param at minimum, option to getReferrals
 * @param {object} options - (Optional) an object with a getReferrals key to fetch referrals
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function getCases(query, options, callback) {
  return state => {
    const { auth } = state;
    const { url } = state.configuration;

    const expandedQuery = expandReferences(query)(state);
    const expandedOptions = expandReferences(options)(state);

    const params = {
      method: 'GET',
      url: `${url}/api/v2/cases`,
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
          const cases = resp.data;
          const metadata = resp.metadata;
          console.log(
            `${cases.length} cases retrieved from request: ${JSON.stringify(
              response.request,
              null,
              2
            )}`
          );

          if (expandedOptions?.withReferrals) {
            for await (const c of cases) {
              const requestParams = {
                method: 'GET',
                url: `${url}/api/v2/cases/${c.id}/referrals`,
                headers: {
                  Authorization: auth.token,
                  'Content-Type': 'application/json',
                },
              };

              const referrals = await new Promise(resolve => {
                request(requestParams, (e, r, b) => {
                  // console.log('🚨 🚨 🚨 referrals response', b);
                  resolve(tryJson(b).data);
                });
              });

              c.referrals = referrals;
            }
          }

          const nextState = composeNextState(state, cases, metadata);
          if (callback) resolve(callback(nextState));
          resolve(nextState);
        }
      });
    });
  };
}