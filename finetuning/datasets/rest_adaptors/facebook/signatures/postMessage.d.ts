/**
 * Post a message on Facebook
 * @public
 * @example
 * postMessage({
 *  "recipient": {
 *     "id": "your-psid"
 *   },
 *   "message": {
 *     "text": "your-message"
 *   }
 * })
 * @function
 * @param {object} params - data to make the fetch
 * @returns {Operation}
 */
export function postMessage(params: object): Operation;