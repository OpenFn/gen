/**
 * Create some resource in Google Cloud Healthcare
 * @public
 * @example
 * createFhirResource(
 *   {
 *     cloudRegion: "us-central1",
 *     projectId: "adjective-noun-123",
 *     datasetId: "my-dataset",
 *     fhirStoreId: "my-fhir-store",
 *   },
 *   {
 *     resourceType: "Patient",
 *     name: [{ use: "official", family: "Smith", given: ["Darcy"] }],
 *     gender: "female",
 *     birthDate: "1970-01-01",
 *   }
 * );
 * @example
 * createFhirResource(
 *   {
 *     cloudRegion: "us-central1",
 *     projectId: "adjective-noun-123",
 *     datasetId: "my-dataset",
 *     fhirStoreId: "my-fhir-store",
 *   },
 *   (state) => ({
 *     resourceType: "Encounter",
 *     status: "finished",
 *     class: {
 *       system: "http://hl7.org/fhir/v3/ActCode",
 *       code: "IMP",
 *       display: "inpatient encounter",
 *     },
 *     reasonCode: [
 *       {
 *         text: "The patient had an abnormal heart rate. She was concerned about this.",
 *       },
 *     ],
 *     subject: {
 *       reference: `Patient/${state.data.id}`,
 *     },
 *   })
 * );
 *
 * @function
 * @param {{cloudRegion: string, projectId: string, datasetId: string, fhirStoreId: string}} [fhirStore] - The FHIR store information.
 *    - `cloudRegion` (string): The cloud region where the FHIR store is located.
 *    - `projectId` (string): The ID of the project that contains the FHIR store.
 *    - `datasetId` (string): The ID of the dataset that contains the FHIR store.
 *    - `fhirStoreId` (string): The ID of the FHIR store.
 * @param {object} resource - The FHIR resource data to be created
 * @param {function} callback - An optional callback function
 * @returns {Operation}
 */
export function createFhirResource(fhirStore?: {
    cloudRegion: string;
    projectId: string;
    datasetId: string;
    fhirStoreId: string;
}, resource: object, callback: Function): Operation;
