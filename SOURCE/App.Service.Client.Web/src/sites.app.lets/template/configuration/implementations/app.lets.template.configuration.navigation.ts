import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TAppletsTemplateConfigurationNavigation } from "../t.app.lets.template.configuration.navigation";

const NAME = 'Template';
const NAV_ROOT = StringService.replaceTemplate(environment.custom.urls.navigation.appletSectionApplets, '');

export const appletsTemplateConfigurationNavigation : TAppletsTemplateConfigurationNavigation = {
  /**
   * Route of navigation urls
   * to views within this applet.
   */
  root: `${NAV_ROOT}`
}

