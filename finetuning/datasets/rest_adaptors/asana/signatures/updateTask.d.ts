/**
 * Update a specific task.
 * @public
 * @example
 * updateTask("taskGid",
 *  {
 *    name: 'test', "approval_status": "pending", "assignee": "12345"
 *  }
 * )
 * @function
 * @param {string} taskGid - Globally unique identifier for the task
 * @param {object} params - Body parameters
 * @param {function} callback - (Optional) callback function
 * @returns {Operation}
 */
export function updateTask(taskGid: string, params: object, callback: Function): Operation;