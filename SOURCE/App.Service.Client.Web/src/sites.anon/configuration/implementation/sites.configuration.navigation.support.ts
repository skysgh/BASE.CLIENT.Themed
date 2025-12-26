import { themesT1ConfigurationNavigationSupport, NAV_ROOT } from "../../../themes/t1/configuration/implementations/themes.t1.configuration.navigation.support";
import { TSitesConfigurationNavigationSupport } from "../t.sites.configuration.navigation.support";

export { NAV_ROOT }

export const sitesConfigurationNavigationSupport: TSitesConfigurationNavigationSupport = {
  ...themesT1ConfigurationNavigationSupport
  // Add more as desired.
}


