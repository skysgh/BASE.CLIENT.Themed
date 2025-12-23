import { themesT1ConfigurationNavigationSettings, NAV_ROOT } from "../../../themes/t1/configuration/implementations/themes.t1.configuration.navigation.settings";
import { TSitesConfigurationNavigationSettings } from "../t.sites.configuration.navigation.settings";

export { NAV_ROOT }

export const sitesConfigurationNavigationSettings: TSitesConfigurationNavigationSettings = {
  ...themesT1ConfigurationNavigationSettings
  //Add or override as required to meet local contract
}


