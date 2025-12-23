
import { sitesConfiguration } from "../../../sites/configuration/implementation/sites.configuration";
import { sitesConfigurationNavigation, NAV_ROOT} from "../../../sites/configuration/implementation/sites.configuration.navigation";
import { TAppsConfigurationNavigation } from "../t.apps.configuration.navigation";
import { appsConfigurationNavigationApps } from "./apps.configuration.navigation.apps";
import { appsConfigurationNavigationAuth } from "./apps.configuration.navigation.auth";
import { appsConfigurationNavigationErrors } from "./apps.configuration.navigation.errors";
import { appsConfigurationNavigationInformation } from "./apps.configuration.navigation.information";
import { appsConfigurationNavigationLandings } from "./apps.configuration.navigation.landings";
import { appsConfigurationNavigationMessages } from "./apps.configuration.navigation.messages";
import { appsConfigurationNavigationPages } from "./apps.configuration.navigation.pages";
import { appsConfigurationNavigationSettings } from "./apps.configuration.navigation.settings";
import { appsConfigurationNavigationSupport } from "./apps.configuration.navigation.support";
import { appsConfigurationNavigationDashboards } from "./apps.configuration.navigation.dashboards";
import { appsConfigurationNavigationTasks } from "./apps.configuration.navigation.tasks";
import { appsConfigurationNavigationSchedules } from "./apps.configuration.navigation.schedules";
import { appsConfigurationNavigationTeams } from "./apps.configuration.navigation.teams";
import { appsConfigurationNavigationPurchases } from "./apps.configuration.navigation.purchases";

const NAME = 'Apps';

/**
 * The Navigation Constants specific to this app.
 * 
 * Tip:
 * Could write your own, or simply
 * start from the default constants
 * and modify from there
 *
 * Note:
 * Most are inherited from lower down (sites, and under that themes).
 */
export const appsConfigurationNavigation: TAppsConfigurationNavigation = {
  ...sitesConfigurationNavigation,
  // Override/Extend here...

  root: `${NAV_ROOT}`,

  // relative:
  siteRoot: sitesConfiguration.navigation.siteRoot,
  up: sitesConfiguration.navigation.up,
  home: sitesConfiguration.navigation.home,

  /**
   * Navigation routes specific to app.lets components.
   */
  apps: appsConfigurationNavigationApps,


  auth: appsConfigurationNavigationAuth,

  dashboards: appsConfigurationNavigationDashboards,

  errors: appsConfigurationNavigationErrors,

  information: appsConfigurationNavigationInformation,

  landings: appsConfigurationNavigationLandings,

  messages: appsConfigurationNavigationMessages,

  pages: appsConfigurationNavigationPages,

  purchases: appsConfigurationNavigationPurchases,

  settings: appsConfigurationNavigationSettings,

  support: appsConfigurationNavigationSupport,


  schedules: appsConfigurationNavigationSchedules,
  tasks: appsConfigurationNavigationTasks,
  teams: appsConfigurationNavigationTeams,
};

