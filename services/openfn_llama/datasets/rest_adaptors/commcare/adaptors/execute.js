import { commonExecute } from '@openfn/language-common';

/**
 * Execute a sequence of operations.
 * Wraps `language-common/execute`, and prepends initial state for commcare.
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
        state.configuration.authType = 'basic';
        state.configuration.baseUrl = 'https://www.commcarehq.org/a/'.concat(
            state.configuration.applicationName
        );
        return commonExecute(...operations)({ ...initialState, ...state });
    };
}
