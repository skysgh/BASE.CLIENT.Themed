
import { appsConfigurationDeveloperSystemOrganisation } from "./apps.configuration.system.developer";
import { appsConfigurationDistributorSystemOrganisation } from "./apps.configuration.system.distributor";
import { appsConfigurationSponsorSystemOrganisation } from "./apps.configuration.system.sponsor";

import { TAppsConfigurationContext } from "../t.apps.configuration.context";
import { appsConfigurationNavigation } from "./apps.configuration.navigation";
import { appsConfigurationOthers } from "./apps.configuration.others";
import { appletsConstants } from '../../../sites.app.lets/constants/implementations/app.lets.constants';



/**
 * Develop this app's description following expected contract:
 *
 * Change this to set a new Sponsor.
 */
export const appsConfigurationContext : TAppsConfigurationContext = {

  // TODO: probably, if a system was distributed, then there
  // is a real posibility that there could be multiple distributors.
  // So this value should be dynamic. But for now, we are using it this way.
  distributor: appsConfigurationDistributorSystemOrganisation,

  /**
   * The sponsor of the system.
   */
  sponsor: appsConfigurationSponsorSystemOrganisation,

  /**
   * The developer of the system
   * 
   */
  developer: appsConfigurationDeveloperSystemOrganisation,

  navigation: appsConfigurationNavigation,

  others: appsConfigurationOthers,

  constants: appletsConstants

}
