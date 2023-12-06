import { resolve as resolveUrl } from 'url';
import { expandReferences } from '@openfn/language-common';
import request from 'superagent'

/**
 * Create a contact
 * @example
 * execute(
 *   createContact(data)
 * )(state)
 * @function
 * @param {object} data - Payload data for the contact
 * @returns {Operation}
 */
export function createContact(data) {
    return state => {
        const body = expandReferences(data)(state);

        const { apiUrl, apiToken } = state.configuration;

        const url = resolveUrl(apiUrl + '/', 'contacts');

        console.log('Posting contact:');
        console.log(body);

        return new Promise((resolve, reject) => {
            request.post(url)
                .type('json')
                .accept('json')
                .set('Authorization', `Token ${apiToken}`)
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
