import { TBaseConfigurationNavigationRoutes } from "../../../core/base/configuration/t.base.configuration.navigation";
import { TThemesT1ConfigurationNavigationAuth } from "./t.themes.t1.configuration.navigation.auth";
import { TThemesT1ConfigurationNavigationErrors } from "./t.themes.t1.configuration.navigation.errors";
import { TThemesT1ConfigurationNavigationMessages } from "./t.themes.t1.configuration.navigation.messages";
import { TThemesT1ConfigurationNavigationSettings } from "./t.themes.t1.configuration.navigation.settings";


/**
 * Contract/Type for defining Navigation Routes
 * that Themes references from the themes
 * layout
 */
export type TThemesT1ConfigurationNavigation = TBaseConfigurationNavigationRoutes & {


  /**
   * Routes to Error Pages (400,500, etc.).
   * 
   */
  errors: TThemesT1ConfigurationNavigationErrors,

  /**
   * The routes specific to
   * themed sign/up/in/lock/out Views.
   *
   * Note that Layout has navigation links
   * to sign in and out.
   * These views are part of this theme.
   */
  auth: TThemesT1ConfigurationNavigationAuth,

  /**
   * Routes to Messages.
   * Note that Layout has a drop down that
   * shows Message summaries.
   * But extended views are in Sites.
   */
  messages: TThemesT1ConfigurationNavigationMessages,


  /**
   * Routes to Settings
   * Note that Layout has a drop down that
   * provides a link to Settings.
   * Hence these routes are defined here.
   * The Views though are in Sites.
   */
  settings: TThemesT1ConfigurationNavigationSettings

}
