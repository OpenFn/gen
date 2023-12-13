import { createPatient } from './createPatient';
import { expandReferences } from '@openfn/language-common';
import axios from 'axios';

jest.mock('axios');

const state = {
    configuration: {
        apiUrl: 'https://example.com/api',
    },
    references: [],
    data: null,
};

describe('createPatient', () => {
    it('should create a new patient instance and add it to the state data', async () => {
        const patient = { name: 'John Doe', age: 30, gender: 'male' };
        const expandedPatient = { name: 'John Doe', age: 30, gender: 'male' };
        const response = {
            data: {
                id: 'abc123',
                name: 'John Doe',
                age: 30,
                gender: 'male',
            },
        };
        const nextState = {
            ...state,
            references: ['abc123'],
            data: response.data,
        };

        axios.post.mockResolvedValue(response);
        expandReferences.mockReturnValueOnce(expandedPatient);

        await expect(createPatient(patient)(state)).resolves.toEqual(
            nextState
        );

        expect(axios.post).toHaveBeenCalledWith(
            'https://example.com/api/Patient',
            expandedPatient
        );
        expect(expandReferences).toHaveBeenCalledWith(patient);
    });

    it('should invoke the callback function with the resulting state', async () => {
        const patient = { name: 'John Doe', age: 30, gender: 'male' };
        const expandedPatient = { name: 'John Doe', age: 30, gender: 'male' };
        const response = {
            data: {
                id: 'abc123',
                name: 'John Doe',
                age: 30,
                gender: 'male',
            },
        };
        const nextState = {
            ...state,
            references: ['abc123'],
            data: response.data,
        };
        const callback = jest.fn();

        axios.post.mockResolvedValue(response);
        expandReferences.mockReturnValueOnce(expandedPatient);

        await expect(
            createPatient(patient, callback)(state)
        ).resolves.toEqual(nextState);

        expect(axios.post).toHaveBeenCalledWith(
            'https://example.com/api/Patient',
            expandedPatient
        );
        expect(expandReferences).toHaveBeenCalledWith(patient);
        expect(callback).toHaveBeenCalledWith(nextState);
    });

    it('should throw an error if the request fails', async () => {
        const patient = { name: 'John Doe', age: 30, gender: 'male' };
        const error = new Error('Request failed');

        axios.post.mockRejectedValue(error);
        expandReferences.mockReturnValueOnce(patient);

        await expect(createPatient(patient)(state)).rejects.toThrow(error);

        expect(axios.post).toHaveBeenCalledWith(
            'https://example.com/api/Patient',
            patient
        );
        expect(expandReferences).toHaveBeenCalledWith(patient);
    });
});