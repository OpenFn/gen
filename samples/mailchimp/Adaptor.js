import { http } from '@openfn/language-common';

const addTagToMember = (callback) => async (outState) => {
  const { list_id, subscriber_hash } = outState.configuration;
  const url = `/lists/${list_id}/members/${subscriber_hash}/tags`;
  
  try {
    const response = await http.post(url);
    const newState = { ...outState, data: response.data };
    return callback(newState);
  } catch (error) {
    console.error(error);
    return outState;
  }
};

export default addTagToMember;