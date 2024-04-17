import {
    post,
} from './post.js';
import { each } from '@openfn/language-common';
import { expect } from 'chai';
import nock from 'nock';

const testServer = nock('https://www.example.com');

describe('post', () => {
    before(() => {
        testServer.post('/api/fake-json').reply(200, function (url, body) {
            return body;
        });

        testServer.post('/api/fake-form').reply(200, function (url, body) {
            return body;
        });

        testServer.post('/api/fake-formData').reply(200, function (url, body) {
            return body;
        });

        testServer
            .post('/api/csv-reader')
            .times(3)
            .reply(200, function (url, body) {
                return body;
            });

        testServer
            .post('/api/fake-custom-success-codes')
            .reply(302, function (url, body) {
                return { ...body, statusCode: 302 };
            });
    });

    it('should make an http request from inside the parseCSV callback', async function () {
        const csv = 'id,name\n1,taylor\n2,mtuchi\n3,joe\n4,stu\n5,elias';
        const state = { references: [], data: [], apiResponses: [] };

        const resultingState = await parseCsv(
            csv,
            { chunkSize: 2 },
            (state, rows) =>
                post(
                    'https://www.example.com/api/csv-reader',
                    {
                        body: rows,
                    },
                    state => {
                        state.apiResponses.push(...state.response.data);
                        return state;
                    }
                )(state)
        )(state);

        expect(resultingState.apiResponses).to.eql([
            { id: '1', name: 'taylor' },
            { id: '2', name: 'mtuchi' },
            { id: '3', name: 'joe' },
            { id: '4', name: 'stu' },
            { id: '5', name: 'elias' },
        ]);
    });

    it('can set JSON on the request body', async () => {
        const state = {
            configuration: {},
            data: { name: 'test', age: 24 },
        };

        const finalState = await execute(
            post('https://www.example.com/api/fake-json', { body: state.data })
        )(state);
        expect(finalState.data).to.eql({ name: 'test', age: 24 });
    });

    it('can set data via Form param on the request body', async () => {
        let form = {
            username: 'fake',
            password: 'fake_pass',
        };
        const state = {
            configuration: {},
            data: form,
        };

        const finalState = await execute(
            post('https://www.example.com/api/fake-form', {
                form: state => state.data,
            })
        )(state);

        expect(finalState.data.body).to.contain(
            'Content-Disposition: form-data; name="username"\r\n\r\nfake'
        );
        expect(finalState.data.body).to.contain(
            'Content-Disposition: form-data; name="password"\r\n\r\nfake_pass'
        );
    });

    it('can set FormData on the request body', async () => {
        let formData = {
            id: 'fake_id',
            parent: 'fake_parent',
            mobile_phone: 'fake_phone',
        };

        const state = {
            configuration: {},
            data: formData,
        };

        const finalState = await execute(
            post('https://www.example.com/api/fake-formData', {
                formData: state => {
                    return state.data;
                },
            })
        )(state);

        expect(finalState.data.body).to.contain(
            'Content-Disposition: form-data; name="id"\r\n\r\nfake_id'
        );
        expect(finalState.data.body).to.contain(
            'Content-Disposition: form-data; name="parent"\r\n\r\nfake_parent'
        );
        expect(finalState.data.body).to.contain(
            'Content-Disposition: form-data; name="mobile_phone"\r\n\r\nfake_phone'
        );
    });

    it('can be called inside an each block', async () => {
        nock('https://www.repeat.com')
            .post('/api/fake-json')
            .times(3)
            .reply(200, function (url, body) {
                return body;
            });

        const state = {
            configuration: {},
            things: [
                { name: 'a', age: 42 },
                { name: 'b', age: 83 },
                { name: 'c', age: 112 },
            ],
            replies: [],
        };

        const finalState = await execute(
            each(
                '$.things[*]',
                post(
                    'https://www.repeat.com/api/fake-json',
                    {
                        body: state => state.data,
                    },
                    next => {
                        next.replies.push(next.response.config.data);
                        return next;
                    }
                )
            )
        )(state);

        expect(finalState.replies).to.eql([
            '{"name":"a","age":42}',
            '{"name":"b","age":83}',
            '{"name":"c","age":112}',
        ]);
    });

    it('can be called inside an each with old "json" request config', async () => {
        nock('https://www.repeat.com')
            .post('/api/fake-json')
            .times(3)
            .reply(200, function (url, body) {
                return body;
            });

        const state = {
            configuration: {},
            things: [
                { name: 'a', age: 42 },
                { name: 'b', age: 83 },
                { name: 'c', age: 112 },
            ],
            replies: [],
        };

        const finalState = await execute(
            each(
                '$.things[*]',
                post(
                    'https://www.repeat.com/api/fake-json',
                    {
                        json: state => state.data,
                    },
                    next => {
                        next.replies.push(next.response.config.data);
                        return next;
                    }
                )
            )
        )(state);

        expect(finalState.replies).to.eql([
            '{"name":"a","age":42}',
            '{"name":"b","age":83}',
            '{"name":"c","age":112}',
        ]);
    });

    it('can set successCodes on the request', async () => {
        let data = {
            id: 'fake_id',
            parent: 'fake_parent',
            mobile_phone: 'fake_phone',
        };
        const state = {
            configuration: {},
            data,
        };
        const finalState = await execute(
            post('https://www.example.com/api/fake-custom-success-codes', {
                data: state => {
                    return state.data;
                },
                options: { successCodes: [302] },
            })
        )(state);

        expect(finalState.data.statusCode).to.eq(302);
    });
});
