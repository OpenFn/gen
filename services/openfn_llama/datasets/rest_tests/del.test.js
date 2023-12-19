import {
    del,
} from './del.js';
import { each } from '@openfn/language-common';
import { expect } from 'chai';
import nock from 'nock';

const testServer = nock('https://www.example.com');

describe('delete', () => {
    before(() => {
        testServer.delete('/api/fake-del-items/6').reply(204, function (url, body) {
            return { ...body };
        });
    });

    it('sends a delete request', async () => {
        const state = {
            configuration: {},
            data: {},
        };
        const finalState = await execute(
            del('https://www.example.com/api/fake-del-items/6', {
                options: {
                    successCodes: [204],
                },
            })
        )(state);

        expect(finalState.data).to.eql({});
    });

    it('can be called inside an each block', async () => {
        nock('https://www.repeat.com')
            .delete('/api/fake-json')
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
                del(
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

        console.log(finalState.replies);

        expect(finalState.replies).to.eql([
            '{"name":"a","age":42}',
            '{"name":"b","age":83}',
            '{"name":"c","age":112}',
        ]);
    });
});