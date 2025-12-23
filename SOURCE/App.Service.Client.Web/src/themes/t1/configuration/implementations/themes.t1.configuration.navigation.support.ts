import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TThemesT1ConfigurationNavigationSupport } from "../t.themes.t1.configuration.navigation.support";



export const NAV_ROOT = StringService.replaceTemplate(environment.custom.urls.navigation.section, 'support/');

export const themesT1ConfigurationNavigationSupport: TThemesT1ConfigurationNavigationSupport = {

  root: `${NAV_ROOT}`

}


