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
export function addRow(db: string, table: string, rowData: object): Operation;
