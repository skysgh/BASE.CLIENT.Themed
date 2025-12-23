import { NAME } from '../../constants/t.core.constants';
import { environment } from "../../../environments/environment";
import { StringService } from "../../services/string.service";
import { TCoreConfigurationNavigation } from "../t.core.configuration.navigation";

const NAV_ROOT = StringService.replaceTemplate(environment.custom.urls.navigation.root, NAME);

/**
 * Navigation route constants
 * specific to Core.
 *
 * Note that Core doesn't have any views, so it probably
 * has no routes - unless we add routes to other apps
 * outside of here.
 *
 * BUT IT SHOULD NOT BE A CONSTANT.
 */
export const coreConfigurationNavigation : TCoreConfigurationNavigation = {
  root: `${NAV_ROOT}`

};



