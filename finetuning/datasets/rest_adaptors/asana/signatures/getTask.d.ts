/**
 * Get a single task of a given project.
 * @public
 * @example
 * getTask("taskGid",
 *  {
 *    opt_fields: "name,notes,assignee"
 *  })
 * @function
 * @param {string} taskGid - Globally unique identifier for the task
 * @param {object} params - Query params to include.
 * @param {function} callback - (Optional) callback function
 * @returns {Operation}
 */
export function getTask(taskGid: string, params: object, callback: Function): Operation;