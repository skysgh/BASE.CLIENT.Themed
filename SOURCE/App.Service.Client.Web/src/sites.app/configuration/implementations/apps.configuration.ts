import { environment } from "../../../environments/environment";
// Interfaces/Types:
import { TBaseConfiguration } from "../../../core/base/configuration/t.base.configuration";
// Parts:
import { appsConfigurationSystemDescription } from "./apps.configuration.system.description";
import { appsConfigurationSystemCopyright } from "./apps.configuration.system.copyright";
// Developed Constants:
import { appsConstants} from "../../constants/implementations/apps.constants";
import { appsConfigurationNavigation } from "./apps.configuration.navigation";
import { appsConfigurationOthers } from "./apps.configuration.others";
import { appsConfigurationTodo } from "./apps.configuration.todo.settings.base_____";
import { appsConfigurationContext } from "./apps.configuration.context.organisations";
import { TAppsConfiguration } from "../t.apps.configuration';
// Services:
//
// Other Configuration:

const APPS_ROOT = 'Apps'

/**
 * Base Configuration, providing
 * access as well
 * to configuration of the other areas (Applets, Core, CoreAg, Themes, Sites)
 *
 * IMPORTANT:
 * You don't code changes here.
 * Change the late loading src/config.json file instead.
 * 
 * IMPORTANT:
 * This base MUST inherit from 'BaseConfigurationType'
 * because the generic core/services/configurationService
 * initialised at startup makes its generic T argument
 * derives from 'BaseConfigurationType'
 */
export const appsConfiguration : TAppsConfiguration = {
  ...appsConstants,
  //, appsConfigurationOthers

  /** Identifier (not the same as description/title) */
  id: APPS_ROOT,
  //...DefaultAppConfigurationBase,

  /** Override: App Description  */
  description: appsConfigurationSystemDescription,

  /** Override: App Context  */
  context: appsConfigurationContext,

  /** Override: App Copyright */
  copyrights: appsConfigurationSystemCopyright,

  //others: defaultAppsConfigurationOthers,

  constants: appsConstants,

  /*** Navigation */
  navigation: appsConfigurationNavigation,

  others: appsConfigurationOthers,

  todo: appsConfigurationTodo,

  
}


