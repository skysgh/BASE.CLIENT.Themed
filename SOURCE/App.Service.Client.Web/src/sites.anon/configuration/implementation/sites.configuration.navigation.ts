import { TSitesConfigurationNavigation } from "../t.sites.configuration.navigation";
import { sitesConfigurationNavigationDashboards } from "./sites.configuration.navigation.dashboards";
import { sitesConfigurationNavigationSupport } from "./sites.configuration.navigation.support";
import { sitesConfigurationNavigationInformation } from "./sites.configuration.navigation.information";
import { sitesConfigurationNavigationLandings } from "./sites.configuration.navigation.landings";
import { sitesConfigurationNavigationAuth } from "./sites.configuration.navigation.auth";
import { sitesConfigurationNavigationErrors } from "./sites.configuration.navigation.errors";
import { sitesConfigurationNavigationMessages } from "./sites.configuration.navigation.messages";
import { sitesConfigurationNavigationPages } from "./sites.configuration.navigation.pages";
import { themesT1ConfigurationNavigation, NAV_ROOT} from "../../../themes/t1/configuration/implementations/themes.t1.configuration.navigation";
import { sitesConfigurationNavigationSettings } from "./sites.configuration.navigation.settings";
import { sitesConfigurationNavigationPurchases } from "./sites.configuration.navigation.purchases";

const NAME = 'Sites';

export { NAV_ROOT };



export const sitesConfigurationNavigation: TSitesConfigurationNavigation = {
  ... themesT1ConfigurationNavigation,

  siteRoot: `/`,

  up: `../`,
  home: `/`,

  root: `${NAV_ROOT}`,

  auth: sitesConfigurationNavigationAuth,

  dashboards: sitesConfigurationNavigationDashboards,

  errors: sitesConfigurationNavigationErrors,

  /**
   * A site, whatever it is (app, brochureware)
   * has settings to control the site, update its brochure
   * text, logos, etc. 
   */

  information: sitesConfigurationNavigationInformation,

  landings: sitesConfigurationNavigationLandings,

  messages: sitesConfigurationNavigationMessages,

  pages: sitesConfigurationNavigationPages,

  purchases: sitesConfigurationNavigationPurchases,

  settings: sitesConfigurationNavigationSettings,

  support: sitesConfigurationNavigationSupport,

  
}


