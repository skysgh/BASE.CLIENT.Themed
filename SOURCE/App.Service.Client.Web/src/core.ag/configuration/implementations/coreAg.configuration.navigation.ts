import { NAME } from "../t.coreAg.configuration";
import { StringService } from "../../../core/services/string.service";
import { environment } from "../../../environments/environment";
import { TCoreAgConfigurationNavigation } from "../t.coreAg.configuration.navigation";

const NAV_ROOT = StringService.replaceTemplate(environment.custom.urls.navigation.root, '');

/**
 * Implementation of
 * `TCoreAgConfigurationNavigation`
 * to define routes specific to CoreAg.
 * 
 *  Note:
 * Don't expect there to be a need for urls that
 * are specific to CoreAg.
 */
export const coreAgConfigurationNavigation: TCoreAgConfigurationNavigation = {

  /**
   * Equivalent of the site root: '/'
   */
  root: `${NAV_ROOT}`,

};
