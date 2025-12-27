import { environment } from "../../../../environments/environment";
import { StringService } from "../../../../core/services/string.service";
import { themesT1Constants } from "../../constants/implementations/themes.t1.constants";
import { ThemesT1ConfigurationType } from "../contracts/t.themes.t1.configuration.type______________";
import { themesT1ConfigurationNavigation } from "./themes.t1.configuration.navigation";
import { themesT1ConfigurationOthers } from "./themes.t1.configuration.others";
import { TThemesT1Configuration } from "../t.themes.t1.configuration";

const ROOT_THEMES_T1 = 'Themes/T1'
/**
 * Constants specific to this theme.
 */

export const NAV_ROOT = StringService.replaceTemplate(environment.custom.urls.navigation.root, '');

/**
 * Theme T1 Configuration.
 * 
 * This is the implementation that provides actual values for the theme configuration.
 * Values defined here can be overridden at runtime via config.json (see EnvConfigService).
 * 
 * ✅ MULTI-ACCOUNT ARCHITECTURE:
 * Branding (logos, titles, descriptions) is NOT stored here!
 * Components must inject AccountService and use:
 *   - accountService.getConfigValue('branding.logo')
 *   - accountService.getConfigValue('branding.logoDark')
 *   - accountService.getConfigValue('name')
 *   - accountService.getConfigValue('description')
 * 
 * This ensures reactive account-specific branding when URL changes:
 *   /foo/pages → FOO logo
 *   /bar/pages → BAR logo
 */
export const themesT1Configuration: TThemesT1Configuration /*: ThemesT1ConfigurationType*/ = {

  description: 'Began as Velzone',

  constants: themesT1Constants,

  navigation: themesT1ConfigurationNavigation,

  others: themesT1ConfigurationOthers,

  /**
   * Default post-login redirect destination.
   * 
   * Why '/dashboards/main/': Most authenticated users need to see their dashboard first.
   * 
   * Override in config.json if your deployment needs different behavior:
   * - Redirect to user profile for first-time users
   * - Redirect to pending tasks view
   * - Redirect to custom landing page
   * 
   * Note: Individual login attempts can still override this via returnUrl query param.
   * Example: /auth/signin?returnUrl=/specific-page will go to /specific-page after login.
   */
  postLoginRedirect: '/dashboards/main/',
}


