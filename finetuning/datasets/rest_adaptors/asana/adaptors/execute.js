// Include all necessary dependencies for this script
import { commonExecute } from '@openfn/language-common';

/**
 * Execute a sequence of operations.
 * Wraps `language-common/execute`, and prepends initial state for http.
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
        return commonExecute(...operations)({
            ...initialState,
            ...state,
        });
    };
}
