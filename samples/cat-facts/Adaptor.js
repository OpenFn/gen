import { composeNextState } from '@openfn/language-common';

/**
 * Retrieves a list of cat breeds and includes it in the state data.
 * Sends a GET request to the /breeds endpoint of Cat.
 * @example
 * getCatBreeds(10, callback)
 * @function
 * @param {number} limit - Max number of breeds to retrieve
 * @param {Function} callback - A callback which is invoked with the resulting state at the end of this operation. Allows users to customize the resulting state. State.data includes the response from Cat.
 * @example <caption>Get a list of cat breeds</caption>
 * getCatBreeds(10)
 * @returns {Function} A function that updates the state with the retrieved cat breeds.
 */
export function getCatBreeds(limit, callback) {
  return state => {
    const { apiUrl, access_token } = state.configuration;

    const url = `${apiUrl}/breeds?access_token=${access_token}&limit=${limit}`;
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then(body => {
        const nextState = composeNextState(state, body);
        if (callback) return callback(nextState);
        return nextState;
      });
  };
}