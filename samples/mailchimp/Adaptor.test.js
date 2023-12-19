import { addTagToListMember } from './addTagToListMember';

const state = {
  configuration: {
    apiUrl: 'https://api.mailchimp.com/3.0',
    apiKey: '1234567890abcdef',
  },
  data: {},
};

describe('addTagToListMember()', () => {
  it('should add a tag to a member in a list', async () => {
    const list_id = 'list123';
    const subscriber_hash = 'subscriber456';
    const tag = 'tag789';

    const nextState = await addTagToListMember(list_id, subscriber_hash, tag)(state);

    expect(nextState).toEqual({
      ...state,
      data: {
        id: 'list123',
        name: 'List Name',
        contact: {
          company: 'Company Name',
          address1: 'Address Line 1',
          address2: 'Address Line 2',
          city: 'City',
          state: 'State',
          zip: 'Zip',
          country: 'Country',
          phone: 'Phone',
        },
        permission_reminder: 'Permission Reminder',
        use_archive_bar: false,
        campaign_defaults: {
          from_name: 'From Name',
          from_email: 'From Email',
          subject: '',
          language: 'en',
        },
        notify_on_subscribe: '',
        notify_on_unsubscribe: '',
        email_type_option: false,
        visibility: 'pub',
        double_optin: false,
        marketing_permissions: false,
        modules: false,
        stats: false,
        _links: [],
        tags: [
          {
            id: 'tag123',
            name: 'Tag Name',
            date_added: '2020-01-01T00:00:00+00:00',
          },
          {
            id: 'tag456',
            name: 'Tag Name',
            date_added: '2020-01-01T00:00:00+00:00',
          },
          {
            id: 'tag789',
            name: 'Tag Name',
            date_added: '2020-01-01T00:00:00+00:00',
          },
        ],
      },
    });
  });
});