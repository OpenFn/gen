// Paste the output of the "signature" step here.

// Output 1
declare function GetRandomCat(callback: (fn: (state: State) => State)): (state: State) => State;
type Cat = { name: string; age: number; };
type State = { configuration: { [key: string]: any }; cat: Cat; };

// Output 2
/* Retrieves a random cat and includes it in the state data.
* Sends a GET request to the /cat endpoint of Cat.
* @parameter callback {Function} - a callback which is invoked with the resulting state at the end of this operation. Allows users to customise the resulting state. State.data includes the response from Cat
* @returns A function that updates the state with the retrieved cat.
*/
declare function GetRandomCat(callback: (fn: (inState: State) => State)): (outState: State) => State;
type Cat = { name: string; age: number; };

type State<C = {}, D = {}> = { configuration: C; data: D; };


// Output 3
/**
    * Retrieves a random cat and includes it in the state data.
    * Sends a GET request to the /cat endpoint of Cat.
    * @parameter callback {Function} - a callback which is invoked with the resulting state at the end of this operation. Allows users to customise the resulting state. State.data includes the response from Cat
    * @returns A function that updates the state with the retrieved cat.
    */
declare function GetRandomCat(callback: (fn: (inState: State) => State)): (outState: State) => State;
type Cat = { name: string; age: number; };

type State<C = {}, D = {}> = { configuration: C; data: Cat; };


// Output 4
/**
    * Retrieves a list of breeds and includes it in the state data.
    * Sends a GET request to the /breeds endpoint.
    * @parameter callback {Function} - a callback which is invoked with the resulting state at the end of this operation. Allows users to customise the resulting state. State.data includes the response from the endpoint
    * @returns A function that updates the state with the retrieved list of breeds.
    */
declare function getBreeds(callback: (fn: (inState: State) => State)): (outState: State) => State;
type Breed = { breed: string; country: string; origin: string; coat: string; pattern: string; };
type C = { url: string; }
type State<C = {}, D = {}> = { configuration: C; data: Breed[]; };
