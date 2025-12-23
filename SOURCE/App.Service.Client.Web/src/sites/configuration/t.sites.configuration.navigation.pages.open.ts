import { TBaseConfigurationNavigationRoutes } from "../../core/base/configuration/t.base.configuration.navigation";
import { TBaseConfigurationObject } from "../../core/base/t.base.configuration.object";
import { TSitesConfigurationNavigationInformation } from "./t.sites.configuration.navigation.information";
import { TSitesConfigurationNavigationLandings } from "./t.sites.configuration.navigation.landings";

export type TSitesConfigurationNavigationPagesOpen = TBaseConfigurationNavigationRoutes & {
  information: TSitesConfigurationNavigationInformation,
  landing: TSitesConfigurationNavigationLandings,
}
