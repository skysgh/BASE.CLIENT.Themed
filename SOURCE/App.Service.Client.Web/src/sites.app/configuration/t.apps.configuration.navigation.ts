import { TAppletsConfigurationNavigation } from '../../sites.app.lets/configuration/t.app.lets.configuration.navigation";
import { TBaseConfigurationNavigationRoutes } from "../../core/base/configuration/t.base.configuration.navigation";
import { TAppsConfigurationNavigationSupport } from "./t.apps.configuration.navigation.support";
import { TAppsConfigurationNavigationDashboards } from "./t.apps.configuration.navigation.dashboards";
import { TAppsConfigurationNavigationSettings } from "./t.apps.configuration.navigation.settings";
import { TAppsConfigurationNavigationAuth } from "./t.apps.configuration.navigation.auth";
import { TAppsConfigurationNavigationErrors } from "./t.apps.configuration.navigation.errors";
import { TAppsConfigurationNavigationPages } from "./t.apps.configuration.navigation.pages";
import { TAppsConfigurationNavigationMessages } from "./t.apps.configuration.navigation.messages";
import { TAppsConfigurationNavigationTasks } from "./t.apps.configuration.navigation.tasks";
import { TAppsConfigurationNavigationSchedules } from "./t.apps.configuration.navigation.schedules";
import { TAppsConfigurationNavigationTeams } from "./t.apps.configuration.navigation.teams";
import { TAppsConfiguration } from "./t.apps.configuration";
import { TAppsConfigurationNavigationPurchases } from "./t.apps.configuration.navigation.purchases";

/**An Apps specific extension of
 * `TBaseConfigurationNavigation`
 * 
 */
export type TAppsConfigurationNavigation = TBaseConfigurationNavigationRoutes & {

  siteRoot: string;
  up: string;
  home: string;

  /**
   *
   * Note:
   * this is the only one that is pointing 'upstream'.
   */
  apps: TAppletsConfigurationNavigation;


  pages: TAppsConfigurationNavigationPages;

  errors: TAppsConfigurationNavigationErrors;

  auth: TAppsConfigurationNavigationAuth;

  support: TAppsConfigurationNavigationSupport;

  settings: TAppsConfigurationNavigationSettings;

  dashboards: TAppsConfigurationNavigationDashboards;

  messages: TAppsConfigurationNavigationMessages;

  purchases: TAppsConfigurationNavigationPurchases;

  tasks: TAppsConfigurationNavigationTasks;
  schedules: TAppsConfigurationNavigationSchedules;
  teams: TAppsConfigurationNavigationTeams;

}
