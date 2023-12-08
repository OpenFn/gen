import {
  composeNextState,
  expandReferences,
  http,
} from '@openfn/language-common';

/**
 * Make a POST request with a certificate
 * @public
 * @example
 * postData({
 *  url: urlDTP,
 *  body: obj,
 *  headers: {
 *    'Ocp-Apim-Subscription-Key': configuration['Ocp-Apim-Subscription-Key'],
 *  },
 *  agentOptions: {
 *    key,
 *    cert,
 *  },
 * }, callback)(state)
 * @function
 * @param {object} params - Url, Headers and Body parameters
 * @param {function} callback - (Optional) A callback function
 * @returns {Operation}
 */
export function postData(params, callback) {
  return state => {
    const { url, body, headers, agentOptions } = expandReferences(params)(
      state
    );

    return http
      .post({
        method: 'post',
        url,
        data: body,
        headers,
        agentOptions,
      })(state)
      .then(response => {
        console.log('POST succeeded.');

        const nextState = composeNextState(state, response);
        if (callback) return callback(nextState);
        return nextState;
      })
      .catch(error => {
        console.log(error);
        return error;
      });
  };
}