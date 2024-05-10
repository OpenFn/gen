import request from 'superagent';

/**
 * Performs a post request
 * @example
 *  clientPost(formData)
 * @function
 * @param {Object} formData - Form Data with auth params and body
 * @returns {State}
 */
function clientPost({ url, body, username, password }) {
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
    });
}
