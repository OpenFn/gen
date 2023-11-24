import { http } from "@openfn/language-common";

/**
 * Retrieves a list of breeds and includes it in the state data.
 * Sends a GET request to the /breeds endpoint.
 * @parameter callback {Function} - a callback which is invoked with the resulting state at the end of this operation. Allows users to customise the resulting state. State.data includes the response from the endpoint
 * @returns A function that updates the state with the retrieved list of breeds.
 */
export const getBreeds = async (callback: (fn: (inState: State) => State)): Promise<(outState: State) => State> => {
    return async (outState: State): Promise<State> => {
        const { url } = outState.configuration;
        const response = await http.get(`${url}/breeds`);
        const data = await response.json();
        const newState = { ...outState, data };
        return callback(newState);
    };
};
