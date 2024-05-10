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
 * Get referrals for a specific case in Primero
 *
 * Use this function to get the list of referrals of one case from Primero.
 * The search can be done using either `record id` or `case id`.
 * @public
 * @example <caption>Get referrals for a case in Primero by record id</caption>
 * getReferrals({
 *   externalId: "record_id",
 *   id: "6aeaa66a-5a92-4ff5-bf7a-e59cde07eaaz",
 * });
 * @example <caption>Get referrals for a case in Primero by case id</caption>
 *  getReferrals({
 *   id: "6aeaa66a-5a92-4ff5-bf7a-e59cde07eaaz",
 * });
 * @function
 * @param {object} params - an object with an externalId field to select the attribute to use for matching on case and an externalId value for that case.
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function getReferrals(params, callback) {
  return state => {
    const { auth } = state;
    const { url } = state.configuration;

    const { externalId, id } = expandReferences(params)(state);

    let requestParams = {};

    if (externalId === 'record_id') {
      console.log('Fetching by record id...');
      requestParams = {
        method: 'GET',
        url: `${url}/api/v2/cases/${id}/referrals`,
        headers: {
          Authorization: auth.token,
          'Content-Type': 'application/json',
        },
      };
      return queryHandler(state, requestParams, callback);
    } else {
      console.log('Fetching by case id...');
      const qs = {
        case_id: `${id}`,
      };
      requestParams = {
        method: 'GET',
        url: `${url}/api/v2/cases`,
        headers: {
          Authorization: auth.token,
          'Content-Type': 'application/json',
        },
        qs,
      };
      return new Promise((resolve, reject) => {
        request(requestParams, (err, resp, body) => {
          const response = scrubResponse(resp);
          const error = assembleError({ error: err, response, params });
          if (error) {
            reject(error);
          } else {
            const resp = tryJson(body);
            if (resp.data.length == 0) {
              reject('No case found');
              return state;
            } else if (resp.data.length === 1) {
              console.log('Case found. Fetching referrals.');
              const id = resp.data[0].id;
              requestParams = {
                method: 'GET',
                url: `${url}/api/v2/cases/${id}/referrals`,
                headers: {
                  Authorization: auth.token,
                  'Content-Type': 'application/json',
                },
              };
              resolve(queryHandler(state, requestParams, callback));
            } else {
              reject(
                'Multiple cases found. Try using another externalId and ensure that it is unique.'
              );
            }
          }
        });
      });
    }
  };
}