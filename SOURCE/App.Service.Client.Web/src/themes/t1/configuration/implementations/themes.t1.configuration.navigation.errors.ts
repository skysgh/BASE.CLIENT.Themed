import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TThemesT1ConfigurationNavigationErrors } from "../t.themes.t1.configuration.navigation.errors";

export const NAV_ROOT = StringService.replaceTemplate(environment.custom.urls.navigation.section, 'errors');

export const themesT1ConfigurationErrors: TThemesT1ConfigurationNavigationErrors = {

  root: `${NAV_ROOT}`,

  /**
   * 
   */
  error404: `${NAV_ROOT}404`,
  /**
   * 
   */
  error500: `${NAV_ROOT}500`,

}
