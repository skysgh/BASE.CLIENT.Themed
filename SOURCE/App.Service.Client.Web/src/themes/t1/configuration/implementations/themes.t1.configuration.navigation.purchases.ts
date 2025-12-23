import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TThemesT1ConfigurationNavigationPurchases } from "../t.themes.t1.configuration.navigation.purchases";



export const NAV_ROOT = StringService.replaceTemplate(environment.custom.urls.navigation.section, 'purchases');

export const themesT1ConfigurationNavigationPurchases: TThemesT1ConfigurationNavigationPurchases = {

  root: `${NAV_ROOT}`,

  checkout: 'TODO'
}


