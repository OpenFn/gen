import { expandReferences } from '@openfn/language-common/util';

/**
 * Get a Drive or SharePoint document library. The drive metadata will be written
 * to state.drives, where it can be used by other adaptor functions.
 * Pass { id } to get a drive by id or { id, owner } to get default drive for
 * some parent resource, like a group
 * @public
 * @example <caption>Get a drive by ID</caption>
 * getDrive({ id: "YXzpkoLwR06bxC8tNdg71m" })
 * @example <caption>Get the default drive for a site</caption>
 * getDrive({ id: "openfn.sharepoint.com", owner: "sites" })
 * @param specifier {Object} - A definition of the drive to retrieve
 *    - id {string} - The ID of the resource or owner.
 *    - owner {string} - The type of drive owner (e.g. sites, groups).
 * @param {string} name - The local name of the drive used to write to state.drives, ie, state.drives[name]
 * @param {function} [callback = s => s] (Optional) Callback function
 * @return {Operation}
 */
export function getDrive(specifier, name = 'default', callback = s => s) {
    return state => {
        const { accessToken, apiVersion } = state.configuration;
        const [resolvedSpecifier, resolvedName] = expandReferences(
            state,
            specifier,
            name
        );

        const { id, owner = 'drive' } = resolvedSpecifier;

        let resource;
        if (owner === 'drive') {
            resource = `drives/${id}`;
        } else {
            resource = `${owner}/${id}/drive`;
        }

        const url = setUrl(resource, apiVersion);

        return request(url, { accessToken }).then(response => {
            state.drives[resolvedName] = response;
            return callback(state);
        });
    };
}