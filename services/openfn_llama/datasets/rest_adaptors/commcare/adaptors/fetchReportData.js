import { http, post } from '@openfn/language-http';

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
export function fetchReportData(reportId, params, postUrl) {
    return http.get(`api/v0.5/configurablereportdata/${reportId}/`, {
        query: function (state) {
            console.log(
                'getting from url: '.concat(
                    state.configuration.baseUrl,
                    `/api/v0.5/configurablereportdata/${reportId}/`
                )
            );
            console.log('with params: '.concat(params));
            return params;
        },
        callback: function (state) {
            var reportData = state.response.body;
            return post(postUrl, {
                body: reportData,
            })(state).then(function (state) {
                delete state.response;
                console.log('fetchReportData succeeded.');
                console.log('Posted to: '.concat(postUrl));
                return state;
            });
        },
    });
}
