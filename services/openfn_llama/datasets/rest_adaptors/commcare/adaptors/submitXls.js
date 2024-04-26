import { http } from '@openfn/language-http';
import FormData from 'form-data';
import xlsx from 'xlsx';

/**
 * Convert form data to xls then submit.
 * @public
 * @example
 * submitXls(
 *    [
 *      {name: 'Mamadou', phone: '000000'},
 *    ],
 *    {
 *      case_type: 'student',
 *      search_field: 'external_id',
 *      create_new_cases: 'on',
 *    }
 * )
 * @function
 * @param {Object} formData - Object including form data.
 * @param {Object} params - Request params including case type and external id.
 * @returns {Operation}
 */
export function submitXls(formData, params) {
    return state => {
        const { applicationName, hostUrl, username, apiKey } = state.configuration;
        const json = expandReferences(formData)(state);
        const { case_type, search_field, create_new_cases } = params;
        const url = (hostUrl || 'https://www.commcarehq.org').concat(
            '/a/',
            applicationName,
            '/importer/excel/bulk_upload_api/'
        );

        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(json);
        const ws_name = 'SheetJS';
        xlsx.utils.book_append_sheet(workbook, worksheet, ws_name);

        // Generate buffer
        const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xls' });
        const data = new FormData();

        data.append('file', buffer, { filename: 'output.xls' });
        data.append('case_type', case_type);
        data.append('search_field', search_field);
        data.append('create_new_cases', create_new_cases);

        console.log('Posting to url: '.concat(url));
        return http
            .post({
                url,
                data,
                headers: {
                    ...data.getHeaders(),
                    Authorization: `ApiKey ${username}:${apiKey}`,
                },
            })(state)
            .then(response => {
                return { ...state, data: { body: response.data } };
            })
            .catch(err => {
                throw { ...err, config: {}, request: {} };
            });
    };
}
