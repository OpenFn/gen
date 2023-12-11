/**
  * Creates a new trackedEntityInstance and includes it in the state data.
  * Sends a POST request to the /trackedEntityInstances endpoint.
  * @example
  * createTrackedEntityInstance({name: 'John Doe', age: 25}, callback)
  * @function
  * @param {Object} trackedEntityInstance - The data of the trackedEntityInstance to be created.
  * @param {Function} callback - A callback which is invoked with the resulting state at the end of this operation. Allows users to customize the resulting state. State.data includes the response from the server.
  * @example <caption>Create a new trackedEntityInstance</caption>
  * createTrackedEntityInstance({name: 'John Doe', age: 25})
  * @returns {Function} A function that updates the state with the created trackedEntityInstance.
  */
  export function createTrackedEntityInstance(trackedEntityInstance: Object, callback?: Function): Operation;