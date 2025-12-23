import { TSitesConfigurationNavigationPagesOpen } from "../t.sites.configuration.navigation.pages.open";

import { sitesConfigurationNavigationInformation } from "./sites.configuration.navigation.information";
import { sitesConfigurationNavigationLandings } from "./sites.configuration.navigation.landings";

export const NAV_ROOT = `pages/open/` 


export const sitesConfigurationNavigationPagesOpen: TSitesConfigurationNavigationPagesOpen = {
  
  root: `${NAV_ROOT}`,

  information: sitesConfigurationNavigationInformation,

  landing: sitesConfigurationNavigationLandings

}

