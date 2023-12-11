/**
  * Creates a new patient instance and includes it in the state data.
  * Sends a POST request to the /Patient endpoint.
  * @example
  * createPatient({name: 'John Doe', age: 30}, callback)
  * @function
  * @param {Object} patientData - The data of the patient to be created. Should include at least a name and age.
  * @param {Function} callback - A callback which is invoked with the resulting state at the end of this operation. Allows users to customize the resulting state. State.data includes the response from the server.
  * @example <caption>Create a new patient</caption>
  * createPatient({name: 'John Doe', age: 30})
  * @returns {Function} A function that updates the state with the created patient instance.
  */
  export function createPatient(patientData: Object, callback?: Function): Operation;