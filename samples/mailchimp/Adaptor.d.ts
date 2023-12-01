/**
* Adds a tag to a member of a list.
* Sends a POST request to the /lists/{list_id}/members/{subscriber_hash}/tags endpoint of the Mailchimp API.
* @parameter callback {{Function}} - a callback which is invoked with the resulting state at the end of this operation. Allows users to customise the resulting state. State.data includes the response from the Mailchimp API.
* @returns A function that updates the state with the response from the Mailchimp API.
*/
declare function addTagToMember(callback: (fn: (inState: State) => State)): (outState: State) => State;
type AddTagToMemberParams = {{ list_id: string; subscriber_hash: string; }};
type AddTagToMemberResponse = any; // Update with the actual response type from the Mailchimp API
type C = {{ baseUrl: string; }};
type State<C = {{}}, D = {{}}> = {{ configuration: C; data: AddTagToMemberResponse; }};