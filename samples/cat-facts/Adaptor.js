import { http } from "@openfn/language-common";

const getCatBreeds = (callback) => async (state) => {
  try {
    const responses = await http.get(`${state.configuration.baseUrl}/breeds`);
    const data = responses.data;
    const newState = { ...state, data: data, references: [] };
    return callback(newState);
  } catch (error) {
    console.error(error);
    return state;
  }
};

export default getCatBreeds;
