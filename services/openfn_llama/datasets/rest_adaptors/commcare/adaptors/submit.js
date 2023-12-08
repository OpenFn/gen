import { expandReferences } from '@openfn/language-common';
import { request } from 'superagent';
import js2xmlparser from 'js2xmlparser';
import FormData from 'form-data';

/**
 * Submit form data
 * @public
 * @example
 *  submit(
 *    fields(
 *      field("@", function(state) {
 *        return {
 *          "xmlns": "http://openrosa.org/formdesigner/form-id-here"
 *        };
 *      }),
 *      field("question1", dataValue("answer1")),
 *      field("question2", "Some answer here.")
 *    )
 *  )
 * @function
 * @param {Object} formData - Object including form data.
 * @returns {Operation}
 */
export function submit(formData) {
    return state => {
        const jsonBody = expandReferences(formData)(state);
        const body = js2xmlparser('data', jsonBody);

        const {
            applicationName,
            username,
            password,
            appId,
            hostUrl,
        } = state.configuration;

        const url = (hostUrl || 'https://www.commcarehq.org').concat(
            '/a/',
            applicationName,
            '/receiver/',
            appId,
            '/'
        );

        console.log('Posting to url: '.concat(url));
        console.log('Raw JSON body: '.concat(JSON.stringify(jsonBody)));
        console.log('X-form submission: '.concat(body));

        // Included clientPost function
        return new Promise((resolve, reject) => {
            request
                .post(url)
                .auth(username, password)
                .set('Content-Type', 'application/xml')
                .send(body)
                .end((error, res) => {
                    if (!!error || !res.ok) {
                        reject(error);
                    }
                    resolve(res);
                });
        })
            .then(response => {
                console.log(`Server responded with a ${response.status}:`);
                console.log(response);
                return { ...state, references: [response, ...state.references] };
            })
            .catch(err => {
                throw { ...err, config: {}, request: {} };
            });
    };
}
