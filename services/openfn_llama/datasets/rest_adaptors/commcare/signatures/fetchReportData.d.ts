/**
 * Make a GET request to CommCare's Reports API
 * and POST the response to somewhere else.
 * @public
 * @example
 * fetchReportData(reportId, params, postUrl)
 * @function
 * @param {String} reportId - API name of the report.
 * @param {Object} params - Query params, incl: limit, offset, and custom report filters.
 * @param {String} postUrl - Url to which the response object will be posted.
 * @returns {Operation}
 */
export function fetchReportData(reportId: string, params: any, postUrl: string): Operation;