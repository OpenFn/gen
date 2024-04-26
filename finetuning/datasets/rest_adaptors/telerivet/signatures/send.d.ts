/**
 * Send a message on telerivet
 * @example
 * execute(
 *   send(data)
 * )(state)
 * @function
 * @param {object} sendData - Payload data for the message
 * @returns {Operation}
 */
export function send(sendData: object): Operation;
