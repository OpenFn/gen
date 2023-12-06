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
 * Upsert case to Primero
 *
 * Use this function to update an existing case from Primero or to create it otherwise.
 * In this implementation, we first fetch the list of cases,
 * then we check if the case exist before choosing the right operation to do.
 * @public
 * @example <caption>Upsert case for a specific case id</caption>
 * upsertCase({
 *   externalIds: ["case_id"],
 *   data: state => ({
 *     age: 20,
 *     sex: "male",
 *     name: "Alex",
 *     status: "open",
 *     case_id: "6aeaa66a-5a92-4ff5-bf7a-e59cde07eaaz",
 *   }),
 * });
 * @function
 * @param {object} params - an object with an externalIds and some case data.
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function upsertCase(params, callback) {
  return state => {
    const { auth } = state;
    const { url } = state.configuration;
    const { data, externalIds } = expandReferences(params)(state);

    const qs = {
      remote: true,
      scope: {},
    };

    externalIds
      .filter(x => data[x])
      .forEach(x => {
        // For every externalId field that is provided, add a key to the
        // scope object in our qs (queryString) and set the value for that key to
        // whatever value is found IN THE DATA for the given externalId.
        return (qs[x] = `${data[x]}`);
      });

    const requestParams = {
      method: 'GET',
      url: `${url}/api/v2/cases`,
      headers: {
        Authorization: auth.token,
        'Content-Type': 'application/json',
      },
      qs,
    };

    // NOTE: while record_id is used in the GET, it must be dropped before -----
    // subsequent create or update calls are made as it's not valid in Primero.
    delete data['record_id'];
    // -------------------------------------------------------------------------

    return new Promise((resolve, reject) => {
      request(requestParams, (err, resp, body) => {
        const response = scrubResponse(resp);
        const error = assembleError({ error: err, response, params });
        if (error) {
          reject(error);
        } else {
          const resp = tryJson(body);
          if (resp.data.length == 0) {
            console.log('No case found. Performing create.');
            resolve(createCase({ data }, callback)(state));
          } else if (resp.data.length > 0) {
            console.log('Case found. Performing update.');
            resolve(updateCase(resp.data[0].id, { data }, callback)(state));
          }
        }
      });
    });
  };
}