import { NAME } from "../t.sites.constants";

import { TBaseConstantsApis } from "../../../core/base/constants/t.base.constants.apis";
import { StringService } from "../../../core/services/string.service";
import { environment } from "../../../environments/environment";
import { TSitesConstantsApisBrochure } from "../t.sites.constants.apis.brochure";

const API_ROOT =
  StringService.replaceTemplate(
    environment.custom.urls.apis.section,
    NAME).toLowerCase();


export const sitesConstantsApisBrochure: TSitesConstantsApisBrochure = {

  feature: `${API_ROOT}base_service_Features`,
  /** API REST endpoint for retrieving and displaying a specific system's subset of available languages */
  languages: `${API_ROOT}base_service_Languages`,
  /** API REST endpoint for service capabilities (for rendering on its landing page, etc.) */
  capabilities: `${API_ROOT}base_service_Capabilities`,
  /** API REST endpoint for service stats (for rendering on its landing page, etc.) */
  stats: `${API_ROOT}base_service_Stats`,
  /** API REST endpoint for service capabilities (for rendering on its landing page, etc.) */
  trustedBy: `${API_ROOT}base_service_TrustedBy`,
  /** API REST endpoint for service user quotes (for rendering on its landing page, etc.) */
  endorsements: `${API_ROOT}base_service_UserEndorsements`,
  /** API REST endpoint for service user faqs (for rendering on its landing page, etc.) */
  faqs: `${API_ROOT}base_service_Faqs`,
  /** API REST endpoint for service user faqs (for rendering on its landing page, etc.) */
  faqsCategories: `${API_ROOT}base_service_FaqCategories`,

  /** API REST endpoint for service team delivery members (for rendering on its landing page, etc.) */
  deliveryTeamMembers: `${API_ROOT}base_service_DeliveryTeamMembers`,

  /** API REST endpoint for service team opportunities (for rendering on its landing page, etc.) */
  jobs: `${API_ROOT}base_service_DeliveryRoleOpportunities`,
}
