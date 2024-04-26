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
export function submitXls(formData: any, params: any): Operation;