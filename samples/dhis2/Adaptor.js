import {
    composeNextState,
    expandReferences,
    http,
} from '@openfn/language-common';

/**
 * Creates a new trackedEntityInstance and includes it in the state data.
 * Sends a POST request to the /trackedEntityInstances endpoint.
 * @example
 * createTrackedEntityInstance({name: 'John Doe', age: 25}, callback)
 * @function
 * @param {Object} data - The data object containing the details of the trackedEntityInstance to be created.
 * @param {Function} callback - A callback which is invoked with the resulting state at the end of this operation. Allows users to customize the resulting state. State.data includes the response from the server.
 * @example <caption>Create a new trackedEntityInstance</caption>
 * createTrackedEntityInstance({name: 'John Doe', age: 25})
 * @returns {Function} A function that updates the state with the created trackedEntityInstance.
 */
export function createTrackedEntityInstance(data, callback) {
    return state => {
        const resolvedData = expandReferences(data)(state);

        const { instanceUrl, accessToken } = state.configuration;

        const url = `${instanceUrl}/api/trackedEntityInstances`;

        const params = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            data: resolvedData,
        };

        return http
            .post({ url, params })(state)
            .then(response => {
                const nextState = {
                    ...state,
                    references: [
                        ...state.references,
                        { id: response.data.response.trackedEntityInstance, type: 'trackedEntityInstance' },
                    ],
                    data: {
                        ...state.data,
                        response,
                    },
                };
                if (callback) return callback(nextState);
                return nextState;
            });
    };
}