/**
 * Get data. Generic helper method for getting data of any kind from DHIS2.
 * - This can be used to get `DataValueSets`,`events`,`trackedEntityInstances`,`etc.`
 * @public
 * @function
 * @param {string} resourceType - The type of resource to get(use its `plural` name). E.g. `dataElements`, `trackedEntityInstances`,`organisationUnits`, etc.
 * @param {Object} query - A query object that will limit what resources are retrieved when converted into request params.
 * @param {Object} [options] - Optional `options` to define URL parameters via params beyond filters, request configuration (e.g. `auth`) and DHIS2 api version to use.
 * @param {function} [callback]  - Optional callback to handle the response
 * @returns {Operation} state
 * @example <caption>all data values for the 'pBOMPrpg1QX' dataset</caption>
 * get('dataValueSets', {
 *   dataSet: 'pBOMPrpg1QX',
 *   orgUnit: 'DiszpKrYNg8',
 *   period: '201401',
 *   fields: '*',
 * });
 * @example <caption>all programs for an organization unit</caption>
 * get('programs', { orgUnit: 'TSyzvBiovKh', fields: '*' });
 * @example <caption>a single tracked entity instance by a unique external ID</caption>
 * get('trackedEntityInstances', {
 *   ou: 'DiszpKrYNg8',
 *   filter: ['flGbXLXCrEo:Eq:124', 'w75KJ2mc4zz:Eq:John'],
 * });
 */
export function get(resourceType: string, query: any, options?: any, callback?: Function): Operation;