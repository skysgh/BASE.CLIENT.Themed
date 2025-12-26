import { StringService } from "../../../core/services/string.service";
import { environment } from "../../../environments/environment";
import { themesT1ConfigurationNavigationMessages, NAV_ROOT } from "../../../themes/t1/configuration/implementations/themes.t1.configuration.navigation.messages";
import { TSitesConfigurationNavigationMessages } from "../t.sites.configuration.navigation.messages";

export { NAV_ROOT }

export const sitesConfigurationNavigationMessages: TSitesConfigurationNavigationMessages = {
  ...themesT1ConfigurationNavigationMessages,
  //Add or override as required to meet local contract
}

