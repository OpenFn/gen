import { http } from '@openfn/language-common';

export function addTagToListMember(list_id, subscriber_hash, tag, callback) {
  return state => {
    const endpoint = `/lists/${list_id}/members/${subscriber_hash}/tags`;
    const url = state.configuration.baseUrl + endpoint;
    const body = {
      tags: [
        {
          name: tag,
          status: 'active'
        }
      ]
    };

    return http.post(url, { body })
      .then(response => {
        const newState = { ...state, data: response.body };
        if (callback) {
          return callback(newState);
        }
        return newState;
      });
  };
}