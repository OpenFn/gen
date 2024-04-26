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
 * Update an existing case in Primero
 *
 * Use this function to update an existing case from Primero.
 * In this implementation, the function uses a case ID to check for the case to update,
 * Then merge the values submitted in this call into an existing case.
 * Fields not specified in this request will not be modified.
 * For nested subform fields, the subform arrays will be recursively merged,
 * keeping both the existing values and appending the new
 * @public
 * @example <caption>Update case for a specific case id</caption>
 * updateCase("6aeaa66a-5a92-4ff5-bf7a-e59cde07eaaz", {
 *   data: {
 *     age: 16,
 *     sex: "female",
 *     name: "Fiona Edgemont",
 *   },
 * });
 * @function
 * @param {string} id - A case ID to use for the update.
 * @param {object} params - an object with some case data.
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function updateCase(id, params, callback) {
  return state => {
    const { auth } = state;
    const { url } = state.configuration;
    const { data } = expandReferences(params)(state);

    const requestParams = {
      method: 'PATCH',
      url: `${url}/api/v2/cases/${id}`,
      headers: {
        Authorization: auth.token,
        'Content-Type': 'application/json',
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
            `PATCH succeeded: ${response.statusCode} ${response.statusMessage}`
          );
          const nextState = composeNextState(state, resp.body?.data);
          if (callback) resolve(callback(nextState));
          resolve(nextState);
        }
      });
    });
  };
}