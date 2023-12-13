import { http } from '@openfn/language-common';

const state = {
    configuration: {
        instanceUrl: 'https://play.dhis2.org/2.34.3',
        accessToken: 'abc123',
    },
};

describe('createTrackedEntityInstance', () => {
    it('should create a new trackedEntityInstance', async () => {
        const data = { trackedEntityType: 'nEenWmSyUEp', orgUnit: 'DiszpKrYNg8' };

        const mockPost = jest.spyOn(http, 'post').mockImplementation(() => {
            return new Promise(resolve => {
                resolve({
                    data: {
                        response: {
                            status: 'SUCCESS',
                            importSummaries: [
                                {
                                    reference: 'X3f9kUvJZ4U',
                                    status: 'SUCCESS',
                                    imported: 1,
                                    updated: 0,
                                    ignored: 0,
                                    deleted: 0,
                                },
                            ],
                        },
                    },
                });
            });
        });

        const { createTrackedEntityInstance } = require('./createTrackedEntityInstance');

        const nextState = await createTrackedEntityInstance(data)(state);

        expect(mockPost).toHaveBeenCalled();
        expect(nextState).toHaveProperty('data.response.status', 'SUCCESS');
        expect(nextState).toHaveProperty('data.response.importSummaries[0].reference', 'X3f9kUvJZ4U');
    });
});