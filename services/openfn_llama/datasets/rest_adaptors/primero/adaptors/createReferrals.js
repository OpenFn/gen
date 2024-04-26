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
 * Create referrals in Primero
 *
 * Use this function to bulk refer to one or multiple cases from Primero to a single user
 * @public
 * @example <caption>Create referrals for multiple cases in Primero</caption>
 * createReferrals({
 *   data: {
 *     ids: [
 *       "749e9c6e-60db-45ec-8f5a-69da7c223a79",
 *       "dcea6052-07d9-4cfa-9abf-9a36987cdd25",
 *     ],
 *     transitioned_to: "primero_cp",
 *     notes: "This is a bulk referral",
 *   },
 * });
 * @function
 * @param {object} params - an object with referral data.
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function createReferrals(params, callback) {
  return state => {
    const { auth } = state;
    const { url } = state.configuration;

    const { data } = expandReferences(params)(state);

    const requestParams = {
      method: 'POST',
      url: `${url}/api/v2/cases/referrals`,
      headers: {
        Authorization: auth.token,
        'Content-Type': 'application/json',
        options: {
          successCodes: [200, 201, 202, 203, 204],
        },
      },
      json: { data: data },
    };

    return new Promise((resolve, reject) => {
      request(requestParams, (err, resp, body) => {
        const response = scrubResponse(resp);
        const error = assembleError({ error: err, response, params });
        if (error) {
          reject(error);
        } else {
          const resp = tryJson(body);
          console.log(
            `Post succeeded: ${response.statusCode} ${response.statusMessage}`
          );
          const nextState = composeNextState(state, resp.data.body);
          if (callback) resolve(callback(nextState));
          resolve(nextState);
        }
      });
    });
  };
}