import { composeNextState, expandReferences, http } from '@openfn/language-common';

/**
 * Get the list of tasks for a given project.
 * @public
 * @param {string} projectGid - Globally unique identifier for the project
 * @param {object} params - Query params to include.
 * @param {function} callback - (Optional) callback function
 * @returns {Operation}
 */
export function getTasks(projectGid, params, callback) {
    return state => {
        const resolvedProjectGid = expandReferences(projectGid)(state);
        const { opt_fields } = expandReferences(params)(state);

        const { apiVersion, token } = state.configuration;

        const url = `https://app.asana.com/api/${apiVersion}/projects/${resolvedProjectGid}/tasks`;

        const config = {
            url,
            headers: { Authorization: `Bearer ${token}` },
            params: {
                opt_fields,
            },
        };

        return http
            .get(config)(state)
            .then(response => {
                const nextState = {
                    ...composeNextState(state, response.data),
                    response,
                };
                if (callback) return callback(nextState);
                return nextState;
            });
    };
}
