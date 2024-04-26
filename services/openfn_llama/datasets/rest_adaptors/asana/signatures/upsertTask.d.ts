/**
 * Update or create a task.
 * @public
 * @example
 * upsertTask(
 *  "1201382240880",
 *  {
 *    "externalId": "name",
 *    "data": {
 *      name: 'test', "approval_status": "pending", "assignee": "12345"
 *    }
 *
 *  }
 * )
 * @function
 * @param {string} projectGid - Globally unique identifier for the project
 * @param {object} params - an object with an externalId and some task data.
 * @param {function} callback - (Optional) callback function
 * @returns {Operation}
 */
export function upsertTask(projectGid: string, params: object, callback: Function): Operation;