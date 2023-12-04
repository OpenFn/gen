/**
  * Adds a tag to a member in a list.
  * Sends a POST request to the /lists/{list_id}/members/{subscriber_hash}/tags endpoint of Mailchimp.
  * @example
  * addTagToListMember('list123', 'subscriber456', 'tag789', callback)
  * @function
  * @param {string} list_id - The ID of the list.
  * @param {string} subscriber_hash - The hash of the subscriber.
  * @param {string} tag - The tag to be added to the member.
  * @param {Function} callback - A callback which is invoked with the resulting state at the end of this operation. Allows users to customize the resulting state. State.data includes the response from Mailchimp.
  * @example <caption>Add a tag to a member</caption>
  * addTagToListMember('list123', 'subscriber456', 'tag789')
  * @returns {Function} A function that updates the state with the added tag to the member.
  */
  export function addTagToListMember(list_id: string, subscriber_hash: string, tag: string, callback?: Function): Operation;