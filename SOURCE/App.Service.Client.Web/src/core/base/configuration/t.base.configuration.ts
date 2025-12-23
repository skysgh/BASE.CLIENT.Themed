import { TBaseConstants } from "../constants/t.base.constants";
import { TBaseConfigurationNavigationRoutes } from "./t.base.configuration.navigation";
import { TBaseConfigurationOthers } from "./i.base.configuration.others";
import { TBaseConfigurationObject } from "../t.base.configuration.object";

/**
 * Base type implemented by
 * each of the various Configuration
 * types (CoreAg, Themes, Sites, Apps).
 *
 * Note: It must remain in Core,
 * as the COnfigurationService refers to this
 * type.
 * 
 */
export type TBaseConfiguration = TBaseConfigurationObject & {


  /** Navigation specific to this group (BaseAg, Themes, Sites, Apps) */
  navigation: TBaseConfigurationNavigationRoutes,

  /**
   * Constants
   */
  constants: TBaseConstants,


  /** Relationship to the Configuration instance
   * for one or more other groups.
   */
  others: TBaseConfigurationOthers

}
