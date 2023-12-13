import { State } from '@openfn/language-common';

const state = {
    data: {},
    references: {},
};

describe('getCatBreeds', () => {
    it('should retrieve a list of cat breeds and include it in the state data', async () => {
        const { data, references } = await run(
            state,
            getCatBreeds(10)
        );
        expect(data).toBeDefined();
        expect(references).toBeDefined();
        expect(data).toHaveProperty('id');
        expect(data).toHaveProperty('name');
        expect(data).toHaveProperty('origin');
        expect(data).toHaveProperty('description');
        expect(data).toHaveProperty('temperament');
        expect(data).toHaveProperty('life_span');
        expect(data).toHaveProperty('adaptability');
        expect(data).toHaveProperty('affection_level');
        expect(data).toHaveProperty('child_friendly');
        expect(data).toHaveProperty('grooming');
        expect(data).toHaveProperty('intelligence');
        expect(data).toHaveProperty('health_issues');
        expect(data).toHaveProperty('social_needs');
        expect(data).toHaveProperty('stranger_friendly');
        expect(references).toHaveProperty('configuration');
    });
});