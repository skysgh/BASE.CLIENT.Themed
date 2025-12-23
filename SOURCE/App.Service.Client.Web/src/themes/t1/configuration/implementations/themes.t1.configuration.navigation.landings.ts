import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TThemesT1ConfigurationNavigationLandings } from "../t.themes.t1.configuration.navigation.landings";

export const NAV_ROOT = StringService.replaceTemplate(environment.custom.urls.navigation.section, 'landings');

export const themesT1ConfigurationNavigationLandings: TThemesT1ConfigurationNavigationLandings = {
  root: `${NAV_ROOT}`,
  default: `${NAV_ROOT}default`,
};
