// Paste the output of the "implementation" step here.


// V1
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
