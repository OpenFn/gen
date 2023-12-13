/* Test */

import { addTagToListMember } from './addTagToListMember';

const state = {
  configuration: {
    apiUrl: 'https://<dc>.api.mailchimp.com/3.0',
    apiKey: '<apiKey>',
  },
  data: {},
};

describe('addTagToListMember', () => {
  it('should add a tag to a member in a list', async () => {
    const list_id = 'list123';
    const subscriber_hash = 'subscriber456';
    const tag = 'tag789';

    const expectedState = {
      ...state,
      data: {
        id: list_id,
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
        date_created: '2021-01-01T00:00:00+00:00',
        list_rating: 0,
        email_count_since_start: 0,
        merge_field_count: 0,
        avg_sub_rate: 0,
        avg_unsub_rate: 0,
        target_sub_rate: 0,
        open_rate: 0,
        click_rate: 0,
        last_sub_date: '',
        last_unsub_date: '',
        tags: [
          {
            id: 'tag123',
            name: 'Tag Name',
            date_added: '2021-01-01T00:00:00+00:00',
          },
        ],
      },
    };

    await expect(addTagToListMember(list_id, subscriber_hash, tag)(state)).resolves.toEqual(
      expectedState
    );
  });
});