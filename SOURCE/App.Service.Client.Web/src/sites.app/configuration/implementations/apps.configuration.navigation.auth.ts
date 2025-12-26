import { sitesConfigurationNavigationAuth, NAV_ROOT } from '../../../sites.anon/configuration/implementation/sites.configuration.navigation.auth';
import { TAppsConfigurationNavigationAuth } from "../t.apps.configuration.navigation.auth";


export const appsConfigurationNavigationAuth: TAppsConfigurationNavigationAuth = {
  ...sitesConfigurationNavigationAuth
  // Override/Extend here...
}
