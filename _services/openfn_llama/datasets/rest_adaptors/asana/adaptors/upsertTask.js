import { composeNextState, expandReferences, http } from '@openfn/language-common';

/**
 * Update or create a task.
 * @public
 * @param {string} projectGid - Globally unique identifier for the project
 * @param {object} params - an object with an externalId and some task data.
 * @param {function} callback - (Optional) callback function
 * @returns {Operation}
 */
export function upsertTask(projectGid, params, callback) {
    return state => {
        const resolvedProjectGid = expandReferences(projectGid)(state);
        const { externalId, data } = expandReferences(params)(state);

        const { apiVersion, token } = state.configuration;

        const url = `https://app.asana.com/api/${apiVersion}/projects/${resolvedProjectGid}/tasks`;

        const config = {
            url,
            headers: { Authorization: `Bearer ${token}` },
            params: {
                opt_fields: `${externalId}`,
            },
        };

        return http
            .get(config)(state)
            .then(response => {
                const matchingTask = response.data.data.find(
                    task => task[externalId] === data[externalId]
                );
                if (matchingTask) {
                    console.log('Matching task found. Performing update.');
                    console.log('Data to update', data);
                    // projects and workspace ids should ne be included to update
                    delete data.projects;
                    delete data.workspace;
                    return updateTask(matchingTask.gid, data, callback)(state);
                } else {
                    console.log('No matching task found. Performing create.');
                    return createTask(data, callback)(state);
                }
            });
    };
}
