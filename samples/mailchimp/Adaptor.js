import { http } from '@openfn/language-common';

const addTagToMember = (callback) => async (outState) => {
  const { list_id, subscriber_hash } = outState.configuration;
  
  try {
    const response = await http.post(`/lists/${list_id}/members/${subscriber_hash}/tags`);
    const newState = { ...outState, data: response.data };
    return callback(newState);
  } catch (error) {
    console.error(error);
    return outState;
  }
};

export default addTagToMember;