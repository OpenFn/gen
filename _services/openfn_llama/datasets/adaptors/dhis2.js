//llama 7B
/**
 * Update data. A generic helper function to update a resource object of any type.
 * Updating an object requires sending `all required fields` or the `full body`.
 * @public
 * @function
 * @param resourceType - The type of resource to be updated. E.g., `dataElements`, `organisationUnits`, etc.
 * @param path - The `id` or `path` to the `object` to be updated. E.g., `FTRrcoaog83` or `FTRrcoaog83/{collection-name}/{object-id}`
 * @param data - Data to update. It requires sending `all required fields` or the `full body`. If you want `partial updates`, use `patch` operation.
 * @param options - Optional `options` to define URL parameters via params (E.g., `filter`, `dimension` and other import parameters), request config (E.g., `auth`), and the DHIS2 apiVersion.
 * @param callback - Optional callback to handle the response
 * @returns A function that updates the state after performing the update operation.
 * @example <caption>a program</caption>
 * update('programs', 'qAZJCrNJK8H', {
 *   name: '14e1aa02c3f0a31618e096f2c6d03bed',
 *   shortName: '14e1aa02',
 *   programType: 'WITHOUT_REGISTRATION',
 * });
 */
declare function update<R = string, P = string, D = unknown, O = { [key: string]: D | null }, C = { [key: string]: C | null >> (
    resourceType: R,
        path: P,
            data: D,
                options: O,
                    callback ?: (inState) => State
 ): (outState) => Operation < R, D, O, C >;

type State<C = { url: string; }, D = { [key: string]: D | null };> = { configuration: C, data: D, };

type Operation<R = string, D = unknown> = { response: R | null, status: number; };


// gpt3.5 175B
/**
 * Update data. A generic helper function to update a resource object of any type.
 * Updating an object requires sending `all required fields` or the `full body`.
 * @public
 * @function
 * @param resourceType - The type of resource to be updated. E.g., `dataElements`, `organisationUnits`, etc.
 * @param path - The `id` or `path` to the `object` to be updated. E.g., `FTRrcoaog83` or `FTRrcoaog83/{collection-name}/{object-id}`
 * @param data - Data to update. It requires sending `all required fields` or the `full body`. If you want `partial updates`, use `patch` operation.
 * @param options - Optional `options` to define URL parameters via params (E.g., `filter`, `dimension` and other import parameters), request config (E.g., `auth`), and the DHIS2 apiVersion.
 * @param callback - Optional callback to handle the response
 * @returns A function that updates the state after performing the update operation.
 * @example <caption>a program</caption>
 * update('programs', 'qAZJCrNJK8H', {
 *   name: '14e1aa02c3f0a31618e096f2c6d03bed',
 *   shortName: '14e1aa02',
 *   programType: 'WITHOUT_REGISTRATION',
 * });
 */
declare function update(
    resourceType: string,
    path: string,
    data: Record<string, any>,
    options?: {
        params?: Record<string, any>;
        requestConfig?: Record<string, any>;
    },
    callback?: (fn: (inState: State) => State) => void
): (state: State) => Promise<State>;

type State<C = {}, D = {}> = { configuration: C; data: D; };


// text-davinci-003 175B
/**
 * Update data. A generic helper function to update a resource object of any type.
 * Updating an object requires to send `all required fields` or the `full body`
 * @public
 * @function
 * @param resourceType {string} - The type of resource to be updated. E.g. `dataElements`, `organisationUnits`, etc.
 * @param path {string} - The `id` or `path` to the `object` to be updated. E.g. `FTRrcoaog83` or `FTRrcoaog83/{collection-name}/{object-id}`
 * @param data {Object} - Data to update. It requires to send `all required fields` or the `full body`. If you want `partial updates`, use `patch` operation.
 * @param [options] {Object} - Optional `options` to define URL parameters via params (E.g. `filter`, `dimension` and other import parameters), request config (E.g. `auth`) and the DHIS2 apiVersion.
 * @param [callback] {function} - Optional callback to handle the response
 * @returns {Operation}
 */
declare function update(resourceType: string, path: string, data: object, options?: object, callback?: (fn: (inState: State) => State)): (outState: State) => State;
type ResourceType = string;
type Path = string;
type Data = object;
type Options = { params?: object; requestConfig?: object; };
type State<C = {{}}, D = {{ }}> = { configuration: C; data: D; };