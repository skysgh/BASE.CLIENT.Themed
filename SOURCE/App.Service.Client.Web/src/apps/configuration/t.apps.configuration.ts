import { TAppsConfigurationNavigation } from "./t.apps.configuration.navigation";


import { appsConstants } from "../constants/implementations/apps.constants";

import { TAppsConfigurationCopyrights } from "./t.apps.configuration.copyrights";
import { TAppsConfigurationDescription } from "./t.apps.configuration.description";
import { TAppsConfigurationOthers } from "./t.apps.configuration.others";
import { TBaseConfiguration } from "../../core/base/configuration/t.base.configuration";
import { TAppsConfigurationContext } from "./t.apps.configuration.context";
import { TAppsConstants } from "../constants/t.apps.constants";



/**
 * Contract for the AppsConfiguration
 *
 * Note:
 * This generally unecessary step
 * is to get around the fact
 * that VS appears to be unable
 * providing Intellisens from an `any`
 */
export type TAppsConfiguration = TBaseConfiguration & {
    /**
     * Assets specific to the App (logo, sponsor images, etc.)
     */

  /**
   * Title, Description, Purpose of the
   * service.
   */
  description: TAppsConfigurationDescription;

  /**
   * Copyright information used
   * in UX and optionally API data.
   */
  copyrights: TAppsConfigurationCopyrights

  /**
   * reference to constants
   * (noting that an actual implementation
   * of this contract will probably)
   * 
   */
  constants: TAppsConstants,// typeof appsConstants,

  context: TAppsConfigurationContext,

  navigation: TAppsConfigurationNavigation,

  others: TAppsConfigurationOthers


}




