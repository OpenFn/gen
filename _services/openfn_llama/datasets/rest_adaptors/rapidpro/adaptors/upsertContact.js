import {
  composeNextState,
  expandReferences,
  http,
} from '@openfn/language-common';

/**
 * Upserts a contact to RapidPro by URN
 * @public
 * @example
 * upsertContact({
 *   name: "Mamadou",
 *   language: "ENG",
 *   urns: ["tel:+250788123123"]
 * });
 * @function
 * @param {object} params - data to upsert a contact
 * @param {function} callback - (Optional) callback function
 * @returns {Operation}
 */
export function upsertContact(params, callback) {
  return state => {
    const resolvedParams = expandReferences(params)(state);

    const { host, apiVersion, token } = state.configuration;

    const url = `${host}/api/${apiVersion || 'v2'}/contacts.json`;

    const config = {
      url,
      data: resolvedParams,
      headers: { Authorization: `Token ${token}` },
    };

    return http
      .post(config)(state)
      .then(resp => {
        console.log('Contact added with uuid:', resp.data.uuid);
        return resp;
      })
      .catch(err => {
        const { data } = err.response;
        if (
          data &&
          data.urns &&
          Array.isArray(data.urns) &&
          data.urns.find(x => x.includes('URN belongs to another'))
        ) {
          const newUrl = `${url}?urn=${config.data.urns[0]}`;
          delete config.data['urns'];
          return http
            .post({ ...config, url: newUrl })(state)
            .then(resp => {
              console.log('Contact updated with uuid:', resp.data.uuid);
              return resp;
            });
        } else {
          console.log(JSON.stringify(data, null, 2));

          delete err.response.request;
          delete err.response.config;

          throw err.response;
        }
      })
      .then(response => {
        const nextState = {
          ...composeNextState(state, response.data),
          response,
        };
        if (callback) return callback(nextState);
        return nextState;
      });
  };
}