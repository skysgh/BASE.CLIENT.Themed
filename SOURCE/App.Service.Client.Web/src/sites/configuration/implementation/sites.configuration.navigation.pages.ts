import { themesT1ConfigurationNavigationPages} from "../../../themes/t1/configuration/implementations/themes.t1.configuration.navigation.pages";
import { TSitesConfigurationNavigationPages } from "../t.sites.configuration.navigation.pages";
import { sitesConfigurationNavigationPagesOpen } from "./sites.configuration.navigation.pages.open";
import { sitesConfigurationNavigationPagesSensitive } from "./sites.configuration.navigation.pages.sensitive";


export const sitesConfigurationNavigationPages: TSitesConfigurationNavigationPages = {
  ...themesT1ConfigurationNavigationPages,
  //Add or override as required to meet local contract

  open: sitesConfigurationNavigationPagesOpen,
  sensitive: sitesConfigurationNavigationPagesSensitive
}


