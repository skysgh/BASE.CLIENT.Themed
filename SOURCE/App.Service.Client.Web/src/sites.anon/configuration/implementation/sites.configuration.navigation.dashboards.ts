import { StringService } from "../../../core/services/string.service";
import { environment } from "../../../environments/environment";
import { TSitesConfigurationNavigationDashboards } from "../t.sites.configuration.navigation.dashboards";

export const NAV_ROOT = StringService.replaceTemplate(environment.custom.urls.navigation.section, 'dashboards');


export const sitesConfigurationNavigationDashboards: TSitesConfigurationNavigationDashboards =  {

  root: `${NAV_ROOT}`,

  main: `${NAV_ROOT}main/`

};


