/**
 * Create a task.
 * @public
 * @example
 * createTask(
 *  {
 *    name: 'test', "approval_status": "pending", "assignee": "12345"
 *  }
 * )
 * @function
 * @param {object} params - Body parameters
 * @param {function} callback - (Optional) callback function
 * @returns {Operation}
 */
export function createTask(params: object, callback: Function): Operation;