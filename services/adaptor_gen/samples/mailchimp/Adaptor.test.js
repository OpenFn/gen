import { addTagToListMember } from './main';

const mockState = {
  configuration: {
    apiUrl: 'https://api.mailchimp.com/3.0',
  },
};

it('should add a tag to a member in a mailing list', async () => {
  const list_id = 'abc123';
  const subscriber_hash = 'def456';
  const tag = 'new_tag';

  const state = {
    ...mockState,
    data: null,
  };

  const nextState = await addTagToListMember(list_id, subscriber_hash, tag)(state);

  console.log('Success:', nextState);
});

it('should handle errors when adding a tag to a member in a mailing list', async () => {
  const list_id = 'abc123';
  const subscriber_hash = 'def456';
  const tag = 'new_tag';

  const state = {
    ...mockState,
    data: null,
  };

  try {
    await addTagToListMember(list_id, subscriber_hash, tag)(state);
  } catch (error) {
    console.error('Error:', error);
  }
});