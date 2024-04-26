import { composeNextState, expandReferences, http } from '@openfn/language-common';

/**
 * Create a task.
 * @public
 * @param {object} params - Body parameters
 * @param {function} callback - (Optional) callback function
 * @returns {Operation}
 */
export function createTask(params, callback) {
    return state => {
        const resolvedParams = expandReferences(params)(state);

        const { apiVersion, token } = state.configuration;

        const url = `https://app.asana.com/api/${apiVersion}/tasks/`;

        const config = {
            url,
            data: { data: resolvedParams },
            headers: { Authorization: `Bearer ${token}` },
        };

        return http
            .post(config)(state)
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
