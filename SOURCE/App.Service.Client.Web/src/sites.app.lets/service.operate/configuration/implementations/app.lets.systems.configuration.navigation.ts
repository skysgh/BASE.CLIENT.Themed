import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TAppletsSystemsConfigurationNavigation } from "../t.app.lets.systems.configuration.navigation";

const NAME = 'System';
const NAV_ROOT = StringService.replaceTemplate(environment.custom.urls.navigation.appletSection, NAME);

export const appletsSystemsConfigurationNavigation : TAppletsSystemsConfigurationNavigation = {
  root: `${NAV_ROOT}`,

  diagnostics: `${NAV_ROOT}diagnostics/`,
  errors: `${NAV_ROOT}errors/`,
  routes: `${NAV_ROOT}routes/`,
  sessions: `${NAV_ROOT}sessions/`,
  operations: `${NAV_ROOT}sessions/operations/`,
  users: `${NAV_ROOT}users/`,
  roles: `${NAV_ROOT}roles/`,
  permissions: `${NAV_ROOT}permissions/`
}

