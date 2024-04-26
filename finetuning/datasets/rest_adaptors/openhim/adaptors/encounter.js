import {
  expandReferences,
} from '@openfn/language-common';
import { resolve as resolveUrl } from 'url';
import request from 'superagent'

/**
 * Create an encounter
 * @example
 * execute(
 *   encounter(data)
 * )(state)
 * @function
 * @param {object} encounterData - Payload data for the encounter
 * @returns {Operation}
 */
export function encounter(encounterData) {
  return state => {
    const body = expandReferences(encounterData)(state);

    const { username, password, apiUrl } = state.configuration;

    const url = resolveUrl(apiUrl + '/', 'chw/encounter');

    console.log('Posting encounter:');
    console.log(JSON.stringify(body, null, 2));

    return new Promise((resolve, reject) => {
      request.post(url)
        .type('json')
        .accept('json')
        .auth(username, password)
        .send(JSON.stringify(body))
        .end((error, res) => {
          if (!!error || !res.ok) {
            reject(error)
          }

          resolve(res)
        })

    }).then(result => {
      console.log('Success:', result);
      return { ...state, references: [result, ...state.references] };
    });
  };
}