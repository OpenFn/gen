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
 * Update a single referral for a specific case in Primero
 * @public
 * @example <caption>Update referral by record id</caption>
 * updateReferral({
 *   caseExternalId: "record_id",
 *   id: "749e9c6e-60db-45ec-8f5a-69da7c223a79",
 *   caseId: "dcea6052-07d9-4cfa-9abf-9a36987cdd25",
 *   data: (state) => state.data,
 * });
 * @function
 * @param {object} params - an object with an caseExternalId value to use, the id and the referral id to update.
 * @param {function} callback - (Optional) Callback function
 * @returns {Operation}
 */
export function updateReferral(params, callback) {
  return state => {
    const { auth } = state;
    const { url } = state.configuration;

    const { caseExternalId, caseId, id, data } =
      expandReferences(params)(state);

    let requestParams = {};

    if (caseExternalId === 'record_id') {
      console.log('Updating referral by record id...');
      requestParams = {
        method: 'PATCH',
        url: `${url}/api/v2/cases/${caseId}/referrals/${id}`,
        headers: {
          Authorization: auth.token,
          'Content-Type': 'application/json',
        },
        json: { data: data },
      };
      return queryHandler(state, requestParams, callback);
    } else {
      console.log('Updating referral by case id...');
      const qs = {
        case_id: `${caseId}`,
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
              console.log('No case found.');
              resolve(state);
              return state;
            } else if (resp.data.length === 1) {
              console.log('Case found. Fetching referrals.');

              const caseRecordId = resp.data[0].id;
              requestParams = {
                method: 'PATCH',
                url: `${url}/api/v2/cases/${caseRecordId}/referrals/${id}`,

                headers: {
                  Authorization: auth.token,
                  'Content-Type': 'application/json',
                },
                json: { data: data },
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