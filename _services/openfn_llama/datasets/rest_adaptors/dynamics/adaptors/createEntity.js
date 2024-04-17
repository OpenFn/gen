import { expandReferences } from '@openfn/language-common';
import { request } from 'request';

/**
 * Create an entity.
 * @function
 * @param {Object} params - Parameters including entityName and body.
 * @returns {Operation}
 */
export function createEntity(params) {
    return state => {
        function assembleError({ response, error }) {
            if (response && [200, 201, 202, 204].indexOf(response.statusCode) > -1)
                return false;
            if (error) return error;
            return new Error(`Server responded with ${response.statusCode}`);
        }

        const { resource, accessToken, apiVersion } = state.configuration;

        const { entityName, body } = expandReferences(params)(state);

        const url = `${resource}/api/data/v${apiVersion}/${entityName}`;

        const headers = {
            'OData-MaxVersion': '4.0',
            'OData-Version': '4.0',
            'Content-Type': 'application/json',
            Authorization: accessToken,
        };

        console.log('Posting to url: ' + url);
        console.log('With body: ' + JSON.stringify(body, null, 2));

        return new Promise((resolve, reject) => {
            request.post(
                {
                    url: url,
                    json: body,
                    headers,
                },
                function (err, response) {
                    const error = assembleError({ error: err, response });
                    if (error) {
                        reject(error);
                    } else {
                        console.log('Create entity succeeded.');
                        resolve(response);
                    }
                }
            );
        }).then(data => {
            const nextState = {
                ...state,
                response: { statusCode: data.statusCode, body: data.body },
            };
            return nextState;
        });
    };
}
