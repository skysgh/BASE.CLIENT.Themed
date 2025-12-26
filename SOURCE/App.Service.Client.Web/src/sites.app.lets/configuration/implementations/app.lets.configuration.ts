import { environment } from "../../../environments/environment";

import { StringService } from "../../../core/services/string.service";

import { appletsConstants } from "../../constants/implementations/app.lets.constants";
import { appletsConfigurationNavigation } from "./app.lets.configuration.navigation";
import { appletsConfigurationOthers } from "./app.lets.configuration.others";
import { TAppletsConfiguration } from "../t.app.lets.configuration";

const ROOT_APPLETS = 'Applets'

/**
 * CoreAg specific configiration
 *
 */
export const appletsConfiguration : TAppletsConfiguration = {
  ...appletsConstants,

  /**
   * Default app to load
   * 
   * Note:
   * that this is overridden by the system
   * pulling in a config.json datasource
   * at startup.
   */
  defaultApp: 'Demo',

  /** List of app.lets that are enabled
   * 
   * Note:
   * that this is overridden by the system
   * pulling in a config.json datasource
   * at startup.
   */
  enabled: ['Demo'],



  /**
   * Easy access to Applets Constants
   */
  constants: appletsConstants,


  /**
   * Navigation to different Applets
   *
   * Note that default values are provided,
   * but they can be overridden at startup
   * if/as required.
   */
  navigation: appletsConfigurationNavigation,




  others: appletsConfigurationOthers,
};


