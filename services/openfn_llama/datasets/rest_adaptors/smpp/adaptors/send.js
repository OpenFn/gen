import {
  expandReferences,
} from '@openfn/language-common';
import request from 'request';

/**
 * Sends an SMS message using the SMPP protocol.
 *
 * @function
 * @param {Object} params - The parameters for sending the SMS.
 * @param {string} params.recipient - The recipient's phone number.
 * @param {string} params.sender - The sender's phone number.
 * @param {string} params.text - The text content of the SMS.
 * @param {string} params.smsId - The unique identifier for the SMS.
 * @returns {Function} - A function that takes a state and returns a promise.
 * @throws {Error} - Throws an error if the server responds with a non-success status code.
 * @example
 * const sendSMS = send({
 *   recipient: '+1234567890',
 *   sender: '+9876543210',
 *   text: 'Hello, World!',
 *   smsId: '123456789'
 * });
 *
 * const newState = sendSMS(initialState)
 *   .then((updatedState) => {
 *     console.log('SMS sent successfully:', updatedState.response.body);
 *   })
 *   .catch((error) => {
 *     console.error('Error sending SMS:', error.message);
 *   });
 */
export function send(params) {
  return state => {
    const { recipient, sender, text, smsId } = expandReferences(params)(state);

    const { systemId, password, clientHost, inboxId } = state.configuration;

    const url = `${clientHost}/smpp/${inboxId}/send`;

    const body = { recipient, sender, text, smsId };

    const auth = {
      username: systemId,
      password: password,
    };

    function assembleError({ response, error }) {
      if (response && [200, 201, 202, 204].indexOf(response.statusCode) > -1)
        return false;
      if (error) return error;
      return new Error(`Server responded with ${response.statusCode}`);
    }

    console.log('Sending message... ' + url);
    console.log('With body: ' + JSON.stringify(body, null, 2));

    return new Promise((resolve, reject) => {
      request.post(
        {
          url: url,
          json: body,
          auth,
        },
        function (err, response, body) {
          const error = assembleError({ error: err, response });
          if (error) {
            reject(error);
          } else {
            console.log(
              'Message sent to SMPP server: ' +
              response.statusCode +
              '/' +
              response.statusMessage
            );
            resolve(response);
          }
        }
      );
    }).then(data => {
      const nextState = { ...state, response: { body: data } };
      return nextState;
    });
  };
}