import { environment } from "../../../../environments/environment";

import { StringService } from "../../../../core/services/string.service";

import { TThemesT1ConfigurationNavigationInformation } from "../t.themes.t1.configuration.navigation.information";
import { themesT1ConfigurationNavigationInformationOrganisation } from "./themes.t1.configuration.navigation.information.organisation";
import { themesT1ConfigurationNavigationInformationService } from "./themes.t1.configuration.navigation.information.service";

export const NAV_ROOT = StringService.replaceTemplate(environment.custom.urls.navigation.section, 'information');


export const themesT1ConfigurationNavigationInformation: TThemesT1ConfigurationNavigationInformation = {
  root: `{NAV_ROOT}`,

  index: `{NAV_ROOT}index`,

  service: themesT1ConfigurationNavigationInformationService,

  organisation: themesT1ConfigurationNavigationInformationOrganisation
};

