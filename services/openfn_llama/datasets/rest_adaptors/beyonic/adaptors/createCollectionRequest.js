import { resolve as resolveUrl } from 'url';
import { expandReferences } from '@openfn/language-common';
import request from 'superagent'

/**
 * Create a collection request
 * @example
 * execute(
 *   createCollectionRequest(data)
 * )(state)
 * @function
 * @param {object} data - Payload data for the collection request
 * @returns {Operation}
 */
export function createCollectionRequest(data) {
    return state => {
        const body = expandReferences(data)(state);

        const { apiUrl, apiToken } = state.configuration;

        const url = resolveUrl(apiUrl + '/', 'collectionrequests');

        console.log('Posting collection request:');
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
