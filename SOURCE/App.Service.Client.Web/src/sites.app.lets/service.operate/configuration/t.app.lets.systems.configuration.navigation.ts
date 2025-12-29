import { TBaseConfigurationNavigationRoutes } from "../../../core/base/configuration/t.base.configuration.navigation";

export type TAppletsSystemsConfigurationNavigation = TBaseConfigurationNavigationRoutes & {

  diagnostics: string,
  errors: string,
  routes: string,
  sessions: string,
  operations: string,
  users: string,
  roles: string,
  permissions: string

}
