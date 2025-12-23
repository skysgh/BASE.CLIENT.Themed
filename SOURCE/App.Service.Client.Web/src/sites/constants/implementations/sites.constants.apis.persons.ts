import { NAME } from "../t.sites.constants";

import { StringService } from "../../../core/services/string.service";
import { environment } from "../../../environments/environment";
import { TSitesConstantsApisPersons } from "../t.sites.constants.apis.persons";

const API_ROOT =
  StringService.replaceTemplate(
    environment.custom.urls.apis.section,
    NAME).toLowerCase();

export const sitesConstantsApisPersons: TSitesConstantsApisPersons = {
  person: `${API_ROOT}person`,
  personIdentityNames: `${API_ROOT}personIdentityNames`,
  app_personIdentities: `${API_ROOT}app_personIdentities`,
  app_persons: `${API_ROOT}app_persons`,
};
