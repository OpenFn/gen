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
export function postData(params: object, callback: Function): Operation;
