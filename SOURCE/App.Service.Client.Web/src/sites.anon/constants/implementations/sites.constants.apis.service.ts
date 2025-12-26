import { NAME } from "../t.sites.constants";

import { TBaseConstantsApis } from "../../../core/base/constants/t.base.constants.apis";
import { StringService } from "../../../core/services/string.service";
import { environment } from "../../../environments/environment";
import { TSitesConstantsApisService } from "../t.sites.constants.apis.service";

const API_ROOT =
  StringService.replaceTemplate(
    environment.custom.urls.apis.section,
    NAME).toLowerCase();

export const sitesConstantsApisService: TSitesConstantsApisService = {

  /** API REST endpoint for retrieving and displaying a specific system's subset of available languages */
  languages: `${API_ROOT}base_service_Languages`,

  /** API REST endpoint for retrieving and displaying service permissions */
  permissions: `${API_ROOT}base_service_Permissions`,

  /** API REST endpoint for retrieving and displaying service notifications */
  notifications: `${API_ROOT}base_service_Notifications`,



}
