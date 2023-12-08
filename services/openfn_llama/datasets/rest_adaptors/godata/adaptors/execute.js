import {
    execute as commonExecute,
} from '@openfn/language-common';
import axios from 'axios';

/**
 * Execute a sequence of operations with login.
 * Wraps `language-common/execute`, and prepends initial state for http.
 * @example
 * execute(
 *   create('foo'),
 *   delete('bar')
 * )(state)
 * @private
 * @param {Operations} operations - Operations to be performed.
 * @returns {Operation}
 */
export function execute(...operations) {
    const initialState = {
        references: [],
        data: null,
    };

    return state => {
        return commonExecute(
            login,
            ...operations
            /* logout */
        )({ ...initialState, ...state }).catch(e => {
            console.error(e);
            /* logout(); */
            process.exit(1);
        });
    };
}

function login(state) {
    const { apiUrl, password, email } = state.configuration;

    return axios({
        method: 'post',
        url: `${apiUrl}/users/login`,
        data: {
            email,
            password,
        },
    }).then(response => {
        console.log('Authentication succeeded.');
        const { id } = response.data;
        return {
            ...state,
            configuration: { ...state.configuration, apiUrl, access_token: id },
        };
    });
}

function logout(state) {
    const { apiUrl, access_token } = state.configuration;
    return axios({
        method: 'post',
        url: `${apiUrl}/users/logout?access_token=${access_token}`,
    }).then(() => {
        console.log('logged out');
        delete state.configuration;
        return state;
    });
}