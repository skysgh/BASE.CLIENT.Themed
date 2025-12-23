import { TSitesConfigurationNavigationPagesOpen } from "./t.sites.configuration.navigation.pages.open"
import { TSitesConfigurationNavigationSettings } from "./t.sites.configuration.navigation.settings"
import { TSitesConfigurationNavigationDashboards } from "./t.sites.configuration.navigation.dashboards"
import { TBaseConfigurationObject } from "../../core/base/t.base.configuration.object"
import { TSitesConfigurationNavigationPagesSensitive } from "./t.sites.configuration.navigation.pages.sensitive"
import { TBaseConfigurationNavigationRoutes } from "../../core/base/configuration/t.base.configuration.navigation"

export type TSitesConfigurationNavigationPages = TBaseConfigurationNavigationRoutes &  {

  open: TSitesConfigurationNavigationPagesOpen
  sensitive: TSitesConfigurationNavigationPagesSensitive,
}

