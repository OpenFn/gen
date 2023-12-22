/* Test */
describe('createTrackedEntityInstance', () => {
  it('creates a new trackedEntityInstance and includes it in the state data', async () => {
    const mockState = {
      configuration: {
        apiUrl: 'https://example.com/api',
      },
    };
    const data = { name: 'John Doe', age: 25 };

    global.expandReferences = jest.fn(() => expandReferencesInput => expandReferencesInput);
    global.http.post = jest.fn(() => state => Promise.resolve({}));

    const expectedPost = {
      url: 'https://example.com/api/trackedEntityInstances',
      data: data,
    };

    await createTrackedEntityInstance(data)(mockState);

    expect(http.post).toHaveBeenCalledWith(expectedPost)(mockState);
  });
});