import { NAME } from '../t.core.constants';
import { environment } from '../../../environments/environment';
import { TBaseConfigurationObject } from '../../base/t.base.configuration.object';
import { StringService } from '../../services/string.service';
import { TCoreConstantsApis } from '../t.core.constants.apis';

const API_ROOT = StringService.replaceTemplate(environment.custom.urls.apis.section, NAME).toLowerCase();


export const coreConstantsApis: TCoreConstantsApis = {
  // Core adds a few more things about APIs
  // that others can reuse:
  recordsPerPage: 20,

  root: `${API_ROOT}`,

  system: {
    /** API REST endpoint for the list of services served from this system */
    services: `${API_ROOT}base_system_Services`,
    /** API REST endpoint for retrieving and displaying server diagnostic records */
    diagnosticTraces: `${API_ROOT}base_system_DiagnosticTraces`,
    /** API REST endpoint for retrieving and displaying server error records */
    errorRecords: `${API_ROOT}base_system_ErrorRecords`,
    /** API REST endpoint for retrieving and displaying server sessions */
    sessions: `${API_ROOT}base_system_Sessions`,
    /** API REST endpoint for retrieving and displaying embargoes applied */
    base_System_Embargoes: `${API_ROOT}base_system_Embargoes`,
    /** API REST endpoint for retrieving and displaying embargoed countries*/
    base_System_ExcludedCountries: `${API_ROOT}base_system_ExcludedExcluded`,
    /** API REST endpoint for retrieving and displaying ip ranges of countries*/
    base_System_ExcludedIPRanges: `${API_ROOT}base_system_ExcludedIpRanges`,
    /** API REST endpoint for retrieving and displaying server session operations */
    sessionOperations: `${API_ROOT}base_system_SessionOperations`,
    /** API REST endpoint for retrieving and displaying system users */
    users: `${API_ROOT}base_system_Users`,
    /** API REST endpoint for retrieving and displaying all system languages */
    languages: `${API_ROOT}base_system_Languages`,
    /** API REST endpoint for retrieving and displaying media encoding types (text, markdown, html, pdf) */
    textMediaEncodingTypes: `${API_ROOT}base_service_TextMediaEncodingTypes`,
    /** API REST endpoint for retrieving and displaying statement types (tracking, privacy,data use) */
    statementTypes: `${API_ROOT}base_system_StatementTypes`
  },

}
