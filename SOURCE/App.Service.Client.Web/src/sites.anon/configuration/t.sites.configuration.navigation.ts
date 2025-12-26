import { TBaseConfiguration } from "../../core/base/configuration/t.base.configuration";
import { TBaseConfigurationNavigationRoutes } from "../../core/base/configuration/t.base.configuration.navigation";
import { TSitesConfigurationNavigationSupport } from "./t.sites.configuration.navigation.support";
import { TSitesConfigurationNavigationDashboards } from "./t.sites.configuration.navigation.dashboards";
import { TSitesConfigurationNavigationPages } from "./t.sites.configuration.navigation.pages";
import { TSitesConfigurationNavigationSettings } from "./t.sites.configuration.navigation.settings";
import { sitesConfigurationNavigationAuth } from "./implementation/sites.configuration.navigation.auth";
import { sitesConfigurationNavigationErrors } from "./implementation/sites.configuration.navigation.errors";
import { TSitesConfigurationNavigationMessages } from "./t.sites.configuration.navigation.messages";
import { TThemesT1ConfigurationNavigation } from "../../themes/t1/configuration/t.themes.t1.configuration.navigation";

export type TSitesConfigurationNavigation =  TThemesT1ConfigurationNavigation & {

  siteRoot: string,
  up: string,
  home: string,

  root: string,

  errors: typeof sitesConfigurationNavigationErrors,

  auth: typeof sitesConfigurationNavigationAuth,

  settings: TSitesConfigurationNavigationSettings

  support: TSitesConfigurationNavigationSupport,

  dashboards: TSitesConfigurationNavigationDashboards,

  pages: TSitesConfigurationNavigationPages,

  messages: TSitesConfigurationNavigationMessages,

}


