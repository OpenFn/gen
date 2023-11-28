Given the following OpenFn instruction:

### Instruction:
Create an OpenFn function that fetches all non-retired patients that match specified parameters

Provide the implementation code that corresponds to the following OpenFn signature. Ensure that all imports are from '@openfn/':

### Signature:
/**
 * Fetch all non-retired patients that match any specified parameters
 * @example
 * searchPatient({ q: Sarah })
 * @function
 * @param {object} query - Object with query for the patient
 * @returns {Operation}
 */
export function searchPatient(query: object): Operation;

import {
  execute as commonExecute,
  expandReferences,
} from '@openfn/language-common';
/**
 * Fetch all non-retired patients that match any specified parameters
 * @example
 * searchPatient({ q: Sarah })
 * @function
 * @param {object} query - Object with query for the patient
 * @returns {Operation}
 */
export function searchPatient(query) {
  return state => {
    const qs = expandReferences(query)(state);
    Log.info(`Searching for patient with name: ${qs.q}`);
    const { instanceUrl } = state.configuration;

    const url = `${instanceUrl}/ws/rest/v1/patient`;

    return agent
      .get(url)
      .accept('json')
      .query(qs)
      .then(response => {
        const data = response.body;
        const count = data.results.length;

        if (count > 0) {
          Log.success(
            `Search successful. Returned ${count} patient${count > 1 ? 's' : ''}.`
          );
          return handleResponse(response, state);
        } else {
          Log.warn(`${count} records were found.`);
        }
      })
      .catch(handleError);
  };
}
