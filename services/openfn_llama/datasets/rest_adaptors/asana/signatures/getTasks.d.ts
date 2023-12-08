/**
 * Get the list of tasks for a given project.
 * @public
 * @example
 * getTasks("projectGid",
 *  {
 *    opt_fields: "name,notes,assignee"
 *  })
 * @function
 * @param {string} projectGid - Globally unique identifier for the project
 * @param {object} params - Query params to include.
 * @param {function} callback - (Optional) callback function
 * @returns {Operation}
 */
export function getTasks(projectGid: string, params: object, callback: Function): Operation;