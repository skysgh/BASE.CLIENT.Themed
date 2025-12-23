import { TBaseConfigurationNavigationRoutes } from "../../../core/base/configuration/t.base.configuration.navigation";

export type TThemesT1ConfigurationNavigationErrors = TBaseConfigurationNavigationRoutes & {

  /**
   * Route to error 404 page.
   */
  error404: string;
  /**
   * Route to error 500 page.
   */
  error500: string;
  // Routes to more error pages as needed...
}
