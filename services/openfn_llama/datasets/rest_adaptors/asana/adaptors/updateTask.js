import { composeNextState, expandReferences, http } from '@openfn/language-common';

/**
 * Update a specific task.
 * @public
 * @param {string} taskGid - Globally unique identifier for the task
 * @param {object} params - Body parameters
 * @param {function} callback - (Optional) callback function
 * @returns {Operation}
 */
export function updateTask(taskGid, params, callback) {
    return state => {
        const resolvedTaskGid = expandReferences(taskGid)(state);
        const resolvedParams = expandReferences(params)(state);

        const { apiVersion, token } = state.configuration;

        const url = `https://app.asana.com/api/${apiVersion}/tasks/${resolvedTaskGid}/`;

        const config = {
            url,
            data: { data: resolvedParams },
            headers: { Authorization: `Bearer ${token}` },
        };

        return http
            .put(config)(state)
            .then(response => {
                const nextState = {
                    ...composeNextState(state, response.data),
                    response,
                };
                if (callback) return callback(nextState);
                return nextState;
            })
            .catch(e => {
                console.log('Asana says:', e.response.data);
                throw e;
            });
    };
}
