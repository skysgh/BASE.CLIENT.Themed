import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TAppletsDemosConfigurationNavigation } from "../t.app.lets.demos.configuration.navigation";

const NAME = 'Demos';
const NAV_ROOT = StringService.replaceTemplate(environment.custom.urls.navigation.appletSection, NAME);

export const appletsDemosConfigurationNavigation : TAppletsDemosConfigurationNavigation = {
  root: `${NAV_ROOT}`
}

