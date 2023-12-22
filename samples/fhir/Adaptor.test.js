/* Test */
describe('createPatient', () => {
  it('creates a new patient instance and adds it to the state data', async () => {
    const initialState = {
      configuration: {
        apiUrl: 'https://example.com/fhir',
      },
      data: null,
    };

    const patient = {
      name: 'John Doe',
      age: 30,
      gender: 'male',
    };

    const mockResponse = {
      resourceType: 'Patient',
      id: '123',
      name: [{ given: ['John'], family: 'Doe' }],
      gender: 'male',
      birthDate: '1992-01-01',
    };

    axios.post.mockResolvedValue({ data: mockResponse });

    const state = await createPatient(patient)(initialState);

    expect(axios.post).toHaveBeenCalledWith(
      'https://example.com/fhir/Patient',
      {
        name: 'John Doe',
        age: 30,
        gender: 'male',
      }
    );

    expect(state).toEqual({
      configuration: {
        apiUrl: 'https://example.com/fhir',
      },
      data: {
        resourceType: 'Patient',
        id: '123',
        name: [{ given: ['John'], family: 'Doe' }],
        gender: 'male',
        birthDate: '1992-01-01',
      },
    });
  });
});