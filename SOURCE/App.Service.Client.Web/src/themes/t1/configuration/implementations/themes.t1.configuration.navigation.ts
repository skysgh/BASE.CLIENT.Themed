import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TThemesT1ConfigurationNavigation } from "../t.themes.t1.configuration.navigation";
import { themesT1ConfigurationNavigationAuth } from "./themes.t1.configuration.navigation.auth";
import { themesT1ConfigurationErrors } from "./themes.t1.configuration.navigation.errors";
import { themesT1ConfigurationNavigationMessages } from "./themes.t1.configuration.navigation.messages";
import { themesT1ConfigurationNavigationSettings } from "./themes.t1.configuration.navigation.settings";

const NAME = 'THemes/T1';
export const NAV_ROOT = StringService.replaceTemplate(environment.custom.urls.navigation.root, '');


export const themesT1ConfigurationNavigation: TThemesT1ConfigurationNavigation = {

  root: `${NAV_ROOT}`,

  /**
   * The Routes specific to
   * themed errors.
   */
  errors: themesT1ConfigurationErrors,

  /**
   * The routes specific to
   * themed sign/up/in/lock/out
   */
  auth: themesT1ConfigurationNavigationAuth,

  /**
   * The routes specific to
   * themed settings.
   */
  settings: themesT1ConfigurationNavigationSettings,

  messages: themesT1ConfigurationNavigationMessages,


};
