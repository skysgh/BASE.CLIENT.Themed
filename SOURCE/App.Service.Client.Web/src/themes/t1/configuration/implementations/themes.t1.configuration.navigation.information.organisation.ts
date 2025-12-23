import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TThemesT1ConfigurationNavigationInformationOrganisation } from "../t.themes.t1.configuration.navigation.information.organisation";

export const NAV_ROOT = `information/organisation/`;

export const themesT1ConfigurationNavigationInformationOrganisation: TThemesT1ConfigurationNavigationInformationOrganisation = {
  root: `${NAV_ROOT}`,

  index: `${NAV_ROOT}index`,

  aboutCompany: `${NAV_ROOT}aboutus`,
  contact: `${NAV_ROOT}contactus`,
  news: `${NAV_ROOT}newsus`,
};
