/**
* Retrieves a list of cat breeds and includes it in the state data.
* Sends a GET request to the /breeds endpoint of Cat.
* @parameter callback {{Function}} - a callback which is invoked with the resulting state at the end of this operation. Allows users to customise the resulting state. State.data includes the response from Cat
* @returns A function that updates the state with the retrieved list of cat breeds.
*/
declare function getCatBreeds(callback: (fn: (inState: State) => State)): (outState: State) => State;
type Breed = {{ breed: string; country: string; origin: string; coat: string; pattern: string; }};
type C = {{baseUrl : string;}}
type State<C = {{}}, D = {{}}> = {{ configuration: C; data: Breed[]; }};
