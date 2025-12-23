
import { coreAgConfigurationNavigation } from "./coreAg.configuration.navigation";
import { coreAgConfigurationOthers } from "./coreAg.configuration.others";
import { coreAgConstants } from "../../constants/implementations/coreAg.constants";
import { TCoreAgConfiguration, NAME } from "../t.coreAg.configuration";

// Private const:
const ROOT_COREAG = 'CoreAg'

/**
 * CoreAg specific configiration
 *
 */
export const coreAgConfiguration : TCoreAgConfiguration = {


  /** Quick access to coreAg Constants */
  constants: coreAgConstants,


  /**
   * Routes are provided by default,
   * but can be overridden at startup
   * if/as needed.
   */
  navigation: coreAgConfigurationNavigation,

  others: coreAgConfigurationOthers,
}
