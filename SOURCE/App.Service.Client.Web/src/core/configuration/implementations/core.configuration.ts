import { coreConstants, NAME } from "../../constants/implementations/core.constants";
import { TCoreConfiguration} from "../t.core.configuration";
import { coreConfigurationNavigation } from "./core.configuration.navigation";
import { coreConfigurationOthers } from "./core.configuration.others";
import { coreIntegrationsEndpoints } from "./core.integrations.endpoints";
import { coreIntegrationsKeys } from "./core.integrations.keys";


/**
 * Implementation of CoreConfigurationType
 * to provide configuration constants for the core module.
 * 
 */

export const coreConfiguration: TCoreConfiguration = {

  /**
   * The default language code
   */
  defaultLanguageCode: 'en',

  /**
   * Quick and easy access to immutable constants specific to core.
   * 
  * Note:
  * name, environment, apis, assets
  * Used to be nested under configuration.
  * But it was too nested for practicality.
   */
  constants: coreConstants,

  /**
   * Routes have default values - but they can be overridden
   * at startup as necessary.
   */
  navigation: coreConfigurationNavigation,

  others: coreConfigurationOthers,

  integrations: {
    endpoints: coreIntegrationsEndpoints,
    keys: coreIntegrationsKeys,
  }
}


