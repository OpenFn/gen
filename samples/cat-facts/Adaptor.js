import { http } from '@openfn/language-common';

const getCatBreeds = (callback) => async (state) => {
  try {
    const response = await http.get(`${state.configuration.baseUrl}/breeds`);
    const data = response.data;
    const newState = { ...state, data: data };
    return callback(newState);
  } catch (error) {
    console.error(error);
    return state;
  }
};

export default getCatBreeds;