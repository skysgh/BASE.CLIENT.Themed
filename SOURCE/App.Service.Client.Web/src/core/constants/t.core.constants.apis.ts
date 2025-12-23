import { TBaseConstantsApis } from "../base/constants/t.base.constants.apis";



export type TCoreConstantsApis = TBaseConstantsApis & {

  recordsPerPage: number,

  system: {
    /** API REST endpoint for the list of services served from this system */
    services: string,
    /** API REST endpoint for retrieving and displaying server diagnostic records */
    diagnosticTraces: string,
    /** API REST endpoint for retrieving and displaying server error records */
    errorRecords: string,
    /** API REST endpoint for retrieving and displaying server sessions */
    sessions: string,
    /** API REST endpoint for retrieving and displaying embargoes applied */
    base_System_Embargoes: string,
    /** API REST endpoint for retrieving and displaying embargoed countries*/
    base_System_ExcludedCountries: string,
    /** API REST endpoint for retrieving and displaying ip ranges of countries*/
    base_System_ExcludedIPRanges: string,
    /** API REST endpoint for retrieving and displaying server session operations */
    sessionOperations: string,
    /** API REST endpoint for retrieving and displaying system users */
    users: string,
    /** API REST endpoint for retrieving and displaying all system languages */
    languages: string,
    /** API REST endpoint for retrieving and displaying media encoding types (text, markdown, html, pdf) */
    textMediaEncodingTypes: string,
    /** API REST endpoint for retrieving and displaying statement types (tracking, privacy,data use) */
    statementTypes: string,
  },

};
