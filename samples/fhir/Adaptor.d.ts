/**
  * Creates a new patient instance with the provided information.
  * Sends a POST request to the /Patient endpoint.
  * @example
  * createPatient({name: 'John Doe', age: 30, gender: 'male'}, callback)
  * @function
  * @param {Object} patientData - The data of the patient to be created. Includes name, age, and gender.
  * @param {Function} callback - A callback which is invoked with the resulting state at the end of this operation. Allows users to customize the resulting state. State.data includes the response from the server.
  * @example <caption>Create a new patient</caption>
  * createPatient({name: 'John Doe', age: 30, gender: 'male'})
  * @returns {Function} A function that creates a new patient instance with the provided information.
  */
  export function createPatient(patientData: {name: string, age: number, gender: string}, callback?: Function): Operation;