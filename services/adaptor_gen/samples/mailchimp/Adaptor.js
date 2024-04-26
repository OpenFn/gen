import { http, expandReferences } from '@openfn/language-http';

/**
 * Adds a tag to a member in a mailing list.
 * @example
 * addTagToListMember('abc123', 'def456', 'new_tag', callback)
 * @function
 * @param {string} list_id - The ID of the mailing list.
 * @param {string} subscriber_hash - The hash of the subscriber.
 * @param {string} tag - The tag to be added to the member.
 * @param {Function} callback - A callback which is invoked with the resulting state at the end of this operation. Allows users to customize the resulting state. State.data includes the response from the mailing list service.
 * @example <caption>Add a tag to a member</caption>
 * addTagToListMember('abc123', 'def456', 'new_tag')
 * @returns {Function} A function that updates the state with the result of adding the tag to the member.
 */
export function addTagToListMember(list_id, subscriber_hash, tag, callback) {
  return state => {
    const url = `${state.configuration.apiUrl}/lists/${list_id}/members/${subscriber_hash}/tags`;
    const data = { tag_name: tag };
    return http
      .post({ url, data: expandReferences(data)(state) })(state)
      .then(response => {
        const nextState = { ...state, data: response };
        if (callback) return callback(nextState);
        return nextState;
      });
  };
}