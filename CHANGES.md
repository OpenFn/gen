// A place to paste each output iteration of the "implementation" step here.

// Paste the output of the "signature" step here.

// Latest
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


// Signature latest
/**
    * Retrieves a random cat and includes it in the state data.
    * Sends a GET request to the /cat endpoint of Cat.
    * @parameter callback {Function} - a callback which is invoked with the resulting state at the end of this operation. Allows users to customise the resulting state. State.data includes the response from Cat
    * @returns A function that updates the state with the retrieved cat.
    */
declare function GetRandomCat(callback: (fn: (inState: State) => State)): (outState: State) => State;
type Cat = { name: string; age: number; };

type State<C = {}, D = {}> = { configuration: C; data: Cat; };





// Latest
import { http } from "@openfn/language-common";

/**
 * Retrieves a list of breeds and includes it in the state data.
 * Sends a GET request to the /breeds endpoint.
 * @parameter callback {Function} - a callback which is invoked with the resulting state at the end of this operation. Allows users to customise the resulting state. State.data includes the response from the endpoint
 * @returns A function that updates the state with the retrieved list of breeds.
 */
export const getBreeds = async (callback: (fn: (inState: State) => State)): Promise<(outState: State) => State> => {
    return async (outState: State): Promise<State> => {
        const { url } = outState.configuration;
        const response = await http.get(`${url}/breeds`);
        const data = await response.json();
        const newState = { ...outState, data };
        return callback(newState);
    };
};


// Embeds parameters like url into State.configuration
/**
 * Retrieves a list of breeds and includes it in the state data.
 * Sends a GET request to the /breeds endpoint.
 * @parameter callback {Function} - a callback which is invoked with the resulting state at the end of this operation. Allows users to customise the resulting state. State.data includes the response from the endpoint
 * @returns A function that updates the state with the retrieved list of breeds.
 */
import { http } from "@openfn/language-common";

async function getBreeds(callback: (fn: (inState: State) => State)): Promise<(outState: State) => State> {
    return async (outState: State): Promise<State> => {
        const { url } = outState.configuration;
        const response = await http.get(`${url}/breeds`);
        const data = response.data as Breed[];
        const newState = { ...outState, data };
        return callback(newState);
    };
}

// V1
// - Uses any Http lib, no OpenFn Fn requirements

// const GetCatBreeds = (callback: (fn: (inState: State) => State) => (outState: State) => {
//     const request = new XMLHttpRequest();
//     request.open('GET', '/breeds', true);
//     request.onload = () => {
//         if (request.status >= 200 && request.status < 400) {
//             const breeds: Breed[] = JSON.parse(request.responseText);
//             const newState: State = {
//                 configuration: outState.configuration,
//                 data: breeds
//             };
//             const updatedState = callback(newState);
//             return updatedState;
//         } else {
//             console.error('Error retrieving breeds');
//         }
//     };
//     request.send();
// };


// V2
// - Uses fetch

// function GetCatBreeds(callback: (fn: (inState: State) => State)): (outState: State) => State {
//     return (outState: State) => {
//         fetch('/breeds')
//             .then(response => response.json())
//             .then(data => {
//                 const newState: State = {
//                     configuration: outState.configuration,
//                     data: data
//                 };
//                 return callback(newState);
//             });
//     };
// }


// V3
// - uses await
// const GetCatBreeds = async (callback: (fn: (inState: State) => State) => (outState: State) => State) => {
//     const response = await fetch('/breeds');
//     const data = await response.json();
//     const newState = { ...state, data: data };
//     return callback(newState);
// };


// V4
// - uses fns from common, uses expandReference (likely incorrect)

// const GetCatBreeds = async (callback: (fn: (inState: State) => State) => (outState: State) => State) => {
//     const response = await http.get('/breeds');
//     const breeds = await expandReferences(response.data);
//     const newState = { ...state, data: breeds };
//     return callback(newState);
//   };


// V5
// - mostly code reformatting
// const GetCatBreeds = async (callback: (fn: (inState: State) => State) => (outState: State) => State) => {
//     const response = await http.get('/breeds');
//     const data = response.data;
//     const newState = { ...state, data: data };
//     return callback(newState);
//   };

// V6 
// - Adds url to State.configuration, header comments added

// const GetCatBreeds = async (callback: (fn: (inState: State) => State) => (outState: State) => State) => {
//     /**
//      * Retrieves a list of breeds and includes it in the state data.
//      * Sends a GET request to the /breeds endpoint.
//      * @parameter callback {{Function}} - a callback which is invoked with the resulting state at the end of this operation. Allows users to customise the resulting state. State.data includes the response from Cat
//      * @returns A function that updates the state with the retrieved list of breeds.
//      */
//     return async (state: State): Promise<State> => {
//       const { configuration } = state;
//       const { url } = configuration;
//       const response = await http.get(`${url}/breeds`);
//       const data = response.data as Breed[];
//       const newState = { ...state, data };
//       return callback(newState);
//     };
//   };


// V7
// - Moved comments to top
// /**
// * Retrieves a list of breeds and includes it in the state data.
// * Sends a GET request to the /breeds endpoint.
// * @parameter callback {{Function}} - a callback which is invoked with the resulting state at the end of this operation. Allows users to customise the resulting state. State.data includes the response from Cat
// * @returns A function that updates the state with the retrieved list of breeds.
// */
// import { http } from "@openfn/language-common";

// declare type Breed = { breed: string; country: string; origin: string; coat: string; pattern: string; };

// type State<C = {}, D = {}> = { configuration: C; data: Breed[]; };

// async function GetCatBreeds(callback: (fn: (inState: State) => State)): Promise<(outState: State) => State> {
//   return async (state: State): Promise<State> => {
//     const { data } = await http.get("/breeds");
//     const newState = { ...state, data };
//     return callback(newState);
//   };
// }

// V8
// - Function name matches camelCase convention

// /**
// * Retrieves a list of breeds and includes it in the state data.
// * Sends a GET request to the /breeds endpoint.
// * @parameter callback {{Function}} - a callback which is invoked with the resulting state at the end of this operation. Allows users to customise the resulting state. State.data includes the response from Cat
// * @returns A function that updates the state with the retrieved list of breeds.
// */
// async function getCatBreeds(callback: (fn: (inState: State) => State)): Promise<(outState: State) => State> {
//     return async (outState: State): Promise<State> => {
//       const response = await http.get('/breeds');
//       const data = response.data as Breed[];
//       const newState = { ...outState, data };
//       return callback(newState);
//     };
//   }


// V9
// Adds imports

// import http from "@openfn/language-common";

// /**
//  * Retrieves a list of breeds and includes it in the state data.
//  * Sends a GET request to the /breeds endpoint.
//  * @parameter callback {{Function}} - a callback which is invoked with the resulting state at the end of this operation. Allows users to customise the resulting state. State.data includes the response from Cat
//  * @returns A function that updates the state with the retrieved list of breeds.
//  */
// async function GetCatBreeds(callback: (fn: (inState: State) => State)): Promise<(outState: State) => State> {
//   return async (outState: State): Promise<State> => {
//     const response = await http.get("/breeds");
//     const breeds = response.data as Breed[];
//     const newState = {
//       ...outState,
//       data: breeds
//     };
//     return callback(newState);
//   };
// }

// type Breed = { breed: string; country: string; origin: string; coat: string; pattern: string; };


// V10
// Embeds parameters like url into State.configuration
// /**
//  * Retrieves a list of breeds and includes it in the state data.
//  * Sends a GET request to the /breeds endpoint.
//  * @parameter callback {Function} - a callback which is invoked with the resulting state at the end of this operation. Allows users to customise the resulting state. State.data includes the response from the endpoint
//  * @returns A function that updates the state with the retrieved list of breeds.
//  */
// import { http } from "@openfn/language-common";

// async function getBreeds(callback: (fn: (inState: State) => State)): Promise<(outState: State) => State> {
//   return async (outState: State): Promise<State> => {
//     const { url } = outState.configuration;
//     const response = await http.get(`${url}/breeds`);
//     const data = response.data as Breed[];
//     const newState = { ...outState, data };
//     return callback(newState);
//   };
// }


// V11
// - JS instead of TS

// /**
//  * Retrieves a list of breeds and includes it in the state data.
//  * Sends a GET request to the /breeds endpoint.
//  * @parameter callback {Function} - a callback which is invoked with the resulting state at the end of this operation. Allows users to customise the resulting state. State.data includes the response from the endpoint
//  * @returns A function that updates the state with the retrieved list of breeds.
//  */
// import { http } from "@openfn/language-common";

// const getBreeds = async (callback: (fn: (inState: State) => State)): (outState: State) => State => {
//   return async (outState: State): Promise<State> => {
//     const { baseUrl } = outState.configuration;
//     const response = await http.get(`${baseUrl}/breeds`);
//     const data = response.data as Breed[];
//     const newState = { ...outState, data: data };
//     return callback(newState);
//   };
// };
