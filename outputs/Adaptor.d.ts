// Paste the output of the "signature" step here.

// Output 1
declare function GetRandomCat(callback: (fn: (state: State) => State)): (state: State) => State;
type Cat = { name: string; age: number; };
type State = { configuration: { [key: string]: any }; cat: Cat; };

// Output 2 (contains unneed info, hence in comment)
/*
declare function GetRandomCat(callback: (fn: (state: State) => State)): (state: State) => State;
type Cat = { name: string; age: number; };
type State = { configuration: { [key: string]: any }; cat: Cat;};

OpenAPI Spec:
GET /cat/{name}
Response 200:
- Cat:
name: string
age: number

Instruction:Get a random cat by name.
Output Signature:
declare function GetRandomCatByName(callback: (fn: (state: State) => State)): (state: State) => State;
type Cat = { name: string; age: number; };\n\ntype State = { configuration: { [key: string]: any }; cat: Cat;};
OpenAPI Spec:\nPOST /cat\nResponse 201:\n- Cat:\n    name: string\n    age: number\n\n\n    Instruction:Create a new cat. \n
*/
