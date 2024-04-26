import request from 'superagent'

/**
 * Execute an SQL statement
 * @example
 * execute(
 *   sql(sqlQuery)
 * )(state)
 * @function
 * @param {object} sqlQuery - Payload data for the message
 * @returns {Operation}
 */
export function sql(sqlQuery) {
    return state => {
        const body = sqlQuery(state);

        const { account, apiKey } = state.configuration;

        const url = 'https://'.concat(account, '.carto.com/api/v2/sql');

        console.log(url);
        console.log('Executing SQL query:');
        console.log(body);

        return new Promise((resolve, reject) => {
            request.get(url)
                .query({ q: body })
                .query({ api_key: apiKey })
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
