import { testConfig } from '@openfn/language-common';
import nock from 'nock';
import { getCatBreeds } from './getCatBreeds';

nock.disableNetConnect();

const configuration = {
  apiUrl: 'https://api.thecatapi.com/v1',
  access_token: 'abc123',
};

const state = {
  configuration,
};

describe('getCatBreeds', () => {
  it('should retrieve a list of cat breeds and include it in the state data', async () => {
    const scope = nock(configuration.apiUrl)
      .get('/breeds')
      .query({ access_token: configuration.access_token, limit: 10 })
      .reply(200, [{ name: 'Abyssinian' }, { name: 'Aegean' }]);

    const nextState = await getCatBreeds(10)(state);

    expect(nextState).toEqual({
      ...state,
      data: [{ name: 'Abyssinian' }, { name: 'Aegean' }],
    });

    scope.done();
  });

  it('should call the callback if provided', async () => {
    const callback = jest.fn();

    const scope = nock(configuration.apiUrl)
      .get('/breeds')
      .query({ access_token: configuration.access_token, limit: 10 })
      .reply(200, [{ name: 'Abyssinian' }, { name: 'Aegean' }]);

    await getCatBreeds(10, callback)(state);

    expect(callback).toHaveBeenCalledWith({
      ...state,
      data: [{ name: 'Abyssinian' }, { name: 'Aegean' }],
    });

    scope.done();
  });

  it('should handle non-200 responses', async () => {
    const scope = nock(configuration.apiUrl)
      .get('/breeds')
      .query({ access_token: configuration.access_token, limit: 10 })
      .reply(404);

    await expect(getCatBreeds(10)(state)).rejects.toThrow();

    scope.done();
  });
});