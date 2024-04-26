// llama
/**
 * Create some resource in msgraph
 * @public
 * @example
 * create("applications", {"displayName": "My App"})
 * @function
 * @param resource - The type of entity that will be created
 * @param data - The data to create the new resource
 * @param callback - An optional callback function
 * @returns A function that updates the state after creating the resource.
 */
declare function create<R = string, D = object>(resource: R, data: D, callback?: (inState: State<R, D>) => State<R, D>): (outState: State<R, D>): Operation < R, D >]: (state: State<R, D>) => Operation < R, D >;


type State<R = string, D = object> = {
    configuration: {
        url: string;
    };
    data: D;
};

type Operation<R = string, D = object> = {
    response: any;
    status: number;
};


//gpt3.5
/**
 * Create some resource in msgraph
 * @public
 * @example
 * create("applications", {"displayName": "My App"})
 * @function
 * @param resource - The type of entity that will be created
 * @param data - The data to create the new resource
 * @param callback - An optional callback function
 * @returns A function that updates the state after creating the resource.
 */
declare function create(
    resource: string,
    data: Record<string, any>,
    callback?: (fn: (inState: State) => State) => void
): (state: State) => Promise<State>;

type State<C = {}, D = {}> = { configuration: C; data: D; };

// text-davinci-003 turbo
/**
 * Create some resource in msgraph
 * @public
 * @example
 * create("applications", {"displayName": "My App"})
 * @function
 * @param {string} resource - The type of entity that will be created
 * @param {object} data - The data to create the new resource
 * @param {function} callback - An optional callback function
 * @returns {Operation}
 */
declare function create(resource: string, data: object, callback?: (fn: (inState: State) => State)): (outState: State) => State;
type C = { accessToken: string; apiVersion: string; }
type State<C = {{}}, D = {{ }}> = { configuration: C; data: any; };