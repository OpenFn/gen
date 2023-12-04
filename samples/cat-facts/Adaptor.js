import { http } from '@openfn/language-common';

export function getCatBreeds(limit, callback) {
  return async function(state) {
    const endpoint = '/breeds';
    const url = state.configuration.baseUrl + endpoint;
    const response = await http.get(url, { params: { limit } });
    const data = response.data;
    const newState = { ...state, data };
    if (callback) {
      return callback(newState);
    }
    return newState;
  };
}