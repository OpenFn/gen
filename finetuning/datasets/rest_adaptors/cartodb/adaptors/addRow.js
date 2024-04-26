import { expandReferences, jsonSql } from 'json-sql';
import request from 'superagent'

/**
 * Add rows to a table
 * @example
 * execute(
 *   addRow(table, rowData)
 * )(state)
 * @function
 * @param {String} table - Table name
 * @param {object} rowData - data to add in the row
 * @returns {Operation}
 */
export function addRow(table, rowData) {
    return state => {
        const dataObject = expandReferences(rowData)(state);

        const sql = jsonSql.build({
            type: 'insert',
            table: table,
            values: dataObject,
        });

        const body = Object.keys(sql.values).reduce(function (query, valueKey) {
            return query.replace(`\$${valueKey}`, `'${sql.values[valueKey]}'`);
        }, sql.query);

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
