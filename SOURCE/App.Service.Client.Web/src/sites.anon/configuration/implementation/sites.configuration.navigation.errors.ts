import { StringService } from "../../../core/services/string.service";
import { environment } from "../../../environments/environment";
import { themesT1ConfigurationErrors, NAV_ROOT} from "../../../themes/t1/configuration/implementations/themes.t1.configuration.navigation.errors";
import { TSitesConfigurationNavigationErrors} from "../t.sites.configuration.navigation.errors";

export {NAV_ROOT }

export const sitesConfigurationNavigationErrors : TSitesConfigurationNavigationErrors = themesT1ConfigurationErrors;
