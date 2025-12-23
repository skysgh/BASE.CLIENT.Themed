import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TThemesT1ConfigurationNavigationPages } from "../t.themes.t1.configuration.navigation.pages";

export const NAV_ROOT = StringService.replaceTemplate(environment.custom.urls.navigation.section, 'pages');

export const themesT1ConfigurationNavigationPages: TThemesT1ConfigurationNavigationPages = {

  root: `${NAV_ROOT}`,

  default: `${NAV_ROOT}default`,
};
