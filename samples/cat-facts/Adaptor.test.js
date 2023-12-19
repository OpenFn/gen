import { getCatBreeds } from './Implementation';

const state = {
    configuration: {
        apiUrl: 'https://api.example.com',
    },
};

describe('getCatBreeds', () => {
    it('should retrieve a list of cat breeds', async () => {
        const httpMock = {
            get: jest.fn().mockResolvedValue({
                data: [
                    { id: 1, name: 'Persian' },
                    { id: 2, name: 'Siamese' },
                    { id: 3, name: 'Maine Coon' },
                ],
            }),
        };

        const expectedState = {
            ...state,
            data: [
                { id: 1, name: 'Persian' },
                { id: 2, name: 'Siamese' },
                { id: 3, name: 'Maine Coon' },
            ],
        };

        await composeNextState(
            state,
            expandReferences({ http: httpMock })(getCatBreeds(10))
        );

        expect(httpMock.get).toHaveBeenCalledWith({
            url: 'https://api.example.com/breeds',
            params: {
                limit: 10,
            },
        });
        expect(result).toEqual(expectedState);
    });
});