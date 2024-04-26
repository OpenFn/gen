import {
  expandReferences,
} from '@openfn/language-common';

/**
 * To add a row data to a database table
 * @example
 * addRow(
 * 'testing_openfn',
 * 'Customers',
 * fields(field('Subject', dataValue('formId')), field('Status', 'Closed'))
 * );
 * @function
 * @param {string} db - Database
 * @param {string} table - Database table
 * @param {object} rowData - row data to be added into the database
 * @returns {Operation}
 */
export function addRow(db, table, rowData) {
  return state => {
    const action = 'ADDROW';
    const body = expandReferences(rowData)(state);

    const { account, authToken, apiVersion } = state.configuration;

    const url = `https://reportsapi.zoho.com/api/`.concat(
      account,
      '/',
      db,
      '/',
      table
    );

    console.log('POST URL:');
    console.log(url);
    console.log('POST Parameters:');
    console.log(body);

    return new Promise((resolve, reject) => {
      request
        .post(url)
        .type('form')
        .query({
          ZOHO_ACTION: action,
          ZOHO_OUTPUT_FORMAT: 'JSON',
          ZOHO_ERROR_FORMAT: 'JSON',
          authtoken: authToken,
          ZOHO_API_VERSION: apiVersion,
        })
        .send(body)
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