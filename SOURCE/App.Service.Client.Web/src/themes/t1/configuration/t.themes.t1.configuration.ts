import { TBaseConfiguration } from "../../../core/base/configuration/t.base.configuration";
import { TThemesT1Constants } from "../constants/t.themes.t1.constants";
import { TThemesT1ConfigurationNavigation } from "./t.themes.t1.configuration.navigation";
import { TThemesT1ConfigurationOthers } from "./t.themes.t1.configuration.others";

/**
 * Type definition for Theme T1 Configuration.
 * 
 * Extends base configuration with theme-specific settings.
 * Includes runtime-overridable post-login redirect destination.
 * 
 * ✅ IMPORTANT: Branding (logos, titles) comes from AccountService, NOT this config!
 * Components should inject AccountService and use getConfigValue('branding.*') for reactive account-specific branding.
 */
export type TThemesT1Configuration = TBaseConfiguration & {

  constants: TThemesT1Constants,

  navigation: TThemesT1ConfigurationNavigation,

  others: TThemesT1ConfigurationOthers,

  /**
   * Destination URL to redirect to after successful login.
   * 
   * Why: Login components shouldn't hard-code where users go after authentication.
   * This allows different deployments (dev, staging, prod, customer-specific) to redirect
   * to different destinations without code changes.
   * 
   * Default: '/dashboards/main/' (see implementation file)
   * Override: Via config.json at runtime
   * 
   * Example config.json override:
   * {
   *   "postLoginRedirect": "/my-custom-dashboard/"
   * }
   */
  postLoginRedirect: string
}
