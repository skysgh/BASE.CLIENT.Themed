import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
// ✅ UPDATED: Import from sites.anon (public tier) not old sites
import { TSitesConfigurationNavigationMessages } from "../../../../sites.anon/configuration/t.sites.configuration.navigation.messages";
import { TThemesT1ConfigurationNavigationMessages } from "../t.themes.t1.configuration.navigation.messages";

export const NAV_ROOT = StringService.replaceTemplate(environment.custom.urls.navigation.section, 'messages');


export const themesT1ConfigurationNavigationMessages: TThemesT1ConfigurationNavigationMessages = {
  root: `{NAV_ROOT}`,

}



