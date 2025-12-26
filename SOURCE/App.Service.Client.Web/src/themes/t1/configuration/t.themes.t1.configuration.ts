import { TBaseConfiguration } from "../../../core/base/configuration/t.base.configuration";
import { TThemesT1Constants } from "../constants/t.themes.t1.constants";
import { TThemesT1ConfigurationNavigation } from "./t.themes.t1.configuration.navigation";
import { TThemesT1ConfigurationOthers } from "./t.themes.t1.configuration.others";

/**
 * Type definition for Theme T1 Configuration.
 * 
 * Extends base configuration with theme-specific settings.
 * Includes runtime-overridable post-login redirect destination.
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
  postLoginRedirect: string,

  /**
   * Branding metadata copied from app configuration.
   * 
   * Why: Theme components need app-level branding (logo, title, description)
   * but shouldn't have upward coupling to appsConfiguration.
   * 
   * Pattern: Copy app metadata into theme config at module init (build time).
   * This creates a "read-only snapshot" that theme components can use.
   * 
   * Trade-off: Slight duplication vs clean tier separation.
   * 
   * What's Included:
   * - logoPath: Path to logo images directory (used by auth pages, layouts)
   * - appTitle: Application title (used by logout, footers)
   * - appDescription: Application description (used by auth pages)
   * 
   * Note: For lazy-loaded modules, this is set at theme module init.
   * Future optimization: Use getter that pulls from EnvConfigService on-demand.
   * 
   * Example Usage (in component):
   * ```typescript
   * public tierConfig = themesT1Configuration;
   * ```
   * 
   * Example Usage (in template):
   * ```html
   * <img [src]="tierConfig.branding.logoPath + 'logo-light.png'">
   * <h1>{{tierConfig.branding.appTitle}}</h1>
   * <p>{{tierConfig.branding.appDescription}}</p>
   * ```
   */
  branding: {
    /** Path to logo images directory (e.g., '/media/apps/images/logos/') */
    logoPath: string;
    
    /** Application title (e.g., 'My Application') */
    appTitle: string;
    
    /** Application description (e.g., 'A modern web application') */
    appDescription: string;
  }
}
