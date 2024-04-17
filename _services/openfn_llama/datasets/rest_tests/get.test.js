import {
    get,
    alterState,
} from './get.js';
import { each } from '@openfn/language-common';
import { expect } from 'chai';
import nock from 'nock';

function stdGet(state) {
    return execute(get('https://www.example.com/api/fake', {}))(state).then(
        nextState => {
            const { data, references } = nextState;
            expect(data).to.haveOwnProperty('httpStatus', 'OK');
            expect(data).to.haveOwnProperty('message', 'the response');

            expect(references).to.eql([{ triggering: 'event' }]);
        }
    );
}

const testServer = nock('https://www.example.com');

describe('get()', () => {
    before(() => {
        testServer.get('/api/fake').times(4).reply(200, {
            httpStatus: 'OK',
            message: 'the response',
        });

        testServer
            .get('/api/showMeMyHeaders')
            .times(3)
            .reply(200, function (url, body) {
                return [url, this.req.headers];
            });

        testServer
            .get('/api/showMeMyHeaders?id=1')
            .reply(200, function (url, body) {
                return [url, this.req.headers];
            });

        testServer
            .get('/api/fake-endpoint')
            .matchHeader('followAllRedirects', true)
            .reply(301, undefined, {
                Location: 'https://www.example.com/api/fake-endpoint-2',
            })
            .get('/api/fake-endpoint-2')
            .reply(302, undefined, {
                Location: 'https://www.example.com/api/fake-endpoint-3',
            })
            .get('/api/fake-endpoint-3')
            .reply(200, function (url, body) {
                return { url };
            });

        testServer.get('/api/fake-cookies').reply(
            200,
            function (url, body) {
                return { url };
            },
            { 'Set-Cookie': ['tasty_cookie=choco'] }
        );

        testServer.get('/api/fake-callback').reply(200, function (url, body) {
            return { url, id: 3 };
        });

        testServer.get('/api/fake-promise').reply(200, function (url, body) {
            return new Promise((resolve, reject) => {
                resolve({ url, id: 3 });
            });
        });

        testServer.get('/api/badAuth').times(2).reply(404);
        testServer.get('/api/crashDummy').times(2).reply(500);
    });

    it('prepares nextState properly', () => {
        let state = {
            configuration: {
                username: 'hello',
                password: 'there',
                baseUrl: 'https://www.example.com',
            },
            data: {
                triggering: 'event',
            },
        };

        return execute(
            alterState(state => {
                state.counter = 1;
                return state;
            }),
            get('/api/fake', {}),
            alterState(state => {
                state.counter = 2;
                return state;
            })
        )(state).then(nextState => {
            const { data, references, counter } = nextState;
            expect(data).to.haveOwnProperty('httpStatus', 'OK');
            expect(data).to.haveOwnProperty('message', 'the response');
            expect(references).to.eql([{ triggering: 'event' }]);
            expect(counter).to.eql(2);
        });
    });

    it('works without a baseUrl', () => {
        let state = {
            configuration: {
                username: 'hello',
                password: 'there',
            },
            data: { triggering: 'event' },
        };
        return stdGet(state);
    });

    it('works with an empty set of credentials', () => {
        let state = {
            configuration: {},
            data: { triggering: 'event' },
        };
        return stdGet(state);
    });

    it('works with no credentials (null)', () => {
        let state = {
            configuration: null,
            data: {
                triggering: 'event',
            },
        };
        return stdGet(state);
    });

    it('accepts headers', async () => {
        const state = {
            configuration: {
                username: 'hello',
                password: 'there',
            },
            data: { triggering: 'event' },
        };

        const finalState = await execute(
            get('https://www.example.com/api/showMeMyHeaders', {
                headers: { 'x-openfn': 'testing' },
            })
        )(state);

        expect(finalState.data[0]).to.eql('/api/showMeMyHeaders');

        expect(finalState.data[1]).to.haveOwnProperty('x-openfn', 'testing');

        expect(finalState.data[1]).to.haveOwnProperty(
            'authorization',
            'Basic aGVsbG86dGhlcmU='
        );

        expect(finalState.data[1]).to.haveOwnProperty('host', 'www.example.com');

        expect(finalState.references).to.eql([{ triggering: 'event' }]);
    });

    it('accepts authentication for http basic auth', async () => {
        const state = {
            configuration: {
                username: 'hello',
                password: 'there',
            },
            data: { triggering: 'event' },
        };

        const finalState = await execute(
            get('https://www.example.com/api/showMeMyHeaders')
        )(state);
        expect(finalState.data[0]).to.eql('/api/showMeMyHeaders');
        expect(finalState.data[1]).to.haveOwnProperty(
            'authorization',
            'Basic aGVsbG86dGhlcmU='
        );
        expect(finalState.data[1]).to.haveOwnProperty('host', 'www.example.com');
    });

    it('can enable gzip', async () => {
        const state = {
            configuration: {},
            data: {},
        };

        const finalState = await execute(
            get('https://www.example.com/api/showMeMyHeaders', { gzip: true })
        )(state);

        expect(finalState.data[0]).to.eql('/api/showMeMyHeaders');

        expect(finalState.data[1]).to.haveOwnProperty(
            'accept-encoding',
            'gzip, deflate'
        );

        expect(finalState.data[1]).to.haveOwnProperty('host', 'www.example.com');
    });

    it('allows query strings to be set', async () => {
        const state = {
            configuration: {},
            data: {},
        };

        const finalState = await execute(
            get('https://www.example.com/api/showMeMyHeaders', { query: { id: 1 } })
        )(state);

        expect(finalState.data[0]).to.eql('/api/showMeMyHeaders?id=1');

        expect(finalState.data[1]).to.haveOwnProperty('host', 'www.example.com');
    });

    it('can follow redirects', async () => {
        const state = {
            configuration: {},
            data: {},
        };

        const finalState = await execute(
            get('https://www.example.com/api/fake-endpoint', {
                headers: { followAllRedirects: true },
            })
        )(state);
        expect(finalState.data.url).to.eql('/api/fake-endpoint-3');
    });

    it('can keep and reuse cookies', async () => {
        const state = {
            configuration: {},
            data: {},
        };

        const finalState = await execute(
            get('https://www.example.com/api/fake-cookies', {
                keepCookie: true,
            })
        )(state);

        expect(finalState.data.__cookie).to.eql('tasty_cookie=choco');
    });

    it('accepts callbacks and calls them with nextState', async () => {
        const state = {
            configuration: {},
            data: {},
        };

        const finalState = await execute(
            get('https://www.example.com/api/fake-callback', {}, state => {
                return state;
            })
        )(state);

        expect(finalState.data.id).to.eql(3);
    });

    it('returns a promise that contains nextState', async () => {
        const state = {
            configuration: {},
            data: {},
        };

        const finalState = await execute(
            get('https://www.example.com/api/fake-promise', {})
        )(state).then(state => state);
        expect(finalState.data.id).to.eql(3);
    });

    it('allows successCodes to be specified via options', async () => {
        const state = {
            configuration: {},
            data: {},
        };

        const finalState = await execute(
            get('https://www.example.com/api/badAuth', {
                options: { successCodes: [404] },
            })
        )(state);

        expect(finalState.response.status).to.eql(404);
    });

    it('throws an error for a non-2XX response', async () => {
        const state = {
            configuration: {},
            data: {},
        };

        const error = await execute(get('https://www.example.com/api/crashDummy'))(
            state
        ).catch(error => error);

        expect(error.response.status).to.eql(500);
    });

    it('can be called inside an each block', async () => {
        nock('https://www.repeat.com')
            .get('/api/fake-json')
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
                get(
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