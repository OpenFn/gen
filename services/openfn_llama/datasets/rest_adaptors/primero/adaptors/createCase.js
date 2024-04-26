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
 * Create a new case in Primero
 *
 * Use this function to create a new case in Primero based on a set of Data.
 * @public
 * @example <caption>Create a new case in Primero based on a set of Data</caption>
 * createCase({
 *   data: {
 *     age: 16,
 *     sex: "female",
 *     name: "Edwine Edgemont",
 *   },
 * });
 * @function
 * @param {object} params - an object with some case data.
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function createCase(params, callback) {
  return state => {
    const { auth } = state;
    const { url } = state.configuration;

    const { data } = expandReferences(params)(state);

    const requestParams = {
      method: 'POST',
      url: `${url}/api/v2/cases`,
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
          const nextState = composeNextState(state, resp.body?.data);
          if (callback) resolve(callback(nextState));
          resolve(nextState);
        }
      });
    });
  };
}