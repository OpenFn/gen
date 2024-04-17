import {
  expandReferences,
} from '@openfn/language-common';
import request from 'superagent';

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
export function send(sendData) {
  return state => {
    const body = expandReferences(sendData)(state);

    const { projectId, apiKey } = state.configuration;

    const url = 'https://api.telerivet.com/v1/projects/'.concat(
      projectId,
      '/messages/send'
    );

    console.log(url);
    console.log('Posting message to send:');
    console.log(body);

    return new Promise((resolve, reject) => {
      request
        .post(url)
        .type('json')
        .accept('json')
        .auth(apiKey)
        .send(JSON.stringify(body))
        .end((error, res) => {
          if (!!error || !res.ok) {
            reject(error);
          }
          resolve(res);
        });
    }).then(result => {
      console.log('Success:', result);
      return { ...state, references: [result, ...state.references] };
    });
  };
}