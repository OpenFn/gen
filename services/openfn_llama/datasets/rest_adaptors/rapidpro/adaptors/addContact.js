import {
  composeNextState,
  expandReferences,
  http,
} from '@openfn/language-common';

/**
 * Adds a new contact to RapidPro
 * @public
 * @example
 * addContact({
 *   name: "Mamadou",
 *   language: "ENG",
 *   urns: ["tel:+250788123123"]
 * });
 * @function
 * @param {object} params - data to create the new resource
 * @param {function} callback - (Optional) callback function
 * @returns {Operation}
 */
export function addContact(params, callback) {
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
      .then(response => {
        console.log('Contact added with uuid:', response.data.uuid);
        const nextState = {
          ...composeNextState(state, response.data),
          response,
        };
        if (callback) return callback(nextState);
        return nextState;
      });
  };
}