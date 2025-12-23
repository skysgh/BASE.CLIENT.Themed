import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TThemesT1ConfigurationNavigationSettings } from "../t.themes.t1.configuration.navigation.settings";

export const NAV_ROOT = StringService.replaceTemplate(environment.custom.urls.navigation.section, 'settings');


export const themesT1ConfigurationNavigationSettings: TThemesT1ConfigurationNavigationSettings = {
 
  root: `${NAV_ROOT}`,

  system: `${NAV_ROOT}system`,
  /** this is wrong.
   * @deprecated
   */
  tenancy: `${NAV_ROOT}account`,

  /** one or more users have roles within an account (e.g. Accountable, Manager, Users)
   * depending on their role (e.g.not User),
   * they can see the accounts
   */
  account: `${NAV_ROOT}account`,
  /**
   * Users have roles within one or more groups
   * with different settings in each.
   */
  group: `${NAV_ROOT}groups`,
  /** Users have their own profiles
   * of which there are several (security, preferences, external identities used to login)
   */
  user: `${NAV_ROOT}profile`,
}
