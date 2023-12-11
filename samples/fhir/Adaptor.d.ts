/**
  * Creates a new patient instance and adds it to the state data.
  * Sends a POST request to the /Patient endpoint.
  * @example
  * createPatient({name: 'John Doe', age: 30, gender: 'male'}, callback)
  * @function
  * @param {Object} patient - The patient object containing name, age, and gender.
  * @param {Function} callback - A callback which is invoked with the resulting state at the end of this operation. Allows users to customize the resulting state. State.data includes the response from the server.
  * @example <caption>Create a new patient</caption>
  * createPatient({name: 'John Doe', age: 30, gender: 'male'})
  * @returns {Function} A function that updates the state with the created patient instance.
  */
  export function createPatient(patient: {name: string, age: number, gender: string}, callback?: Function): Operation;