import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TAppletsArchitectureConfigurationNavigation } from "../t.app.lets.architecture.configuration.navigation";

const NAME = 'Architecture';
const NAV_ROOT = StringService.replaceTemplate(environment.custom.urls.navigation.appletSection, NAME);

export const appletsArchitectureConfigurationNavigation : TAppletsArchitectureConfigurationNavigation = {
  root: `${NAV_ROOT}values/`,
  values: `${NAV_ROOT}values/`,
  qualities: `${NAV_ROOT}qualities/`,
  principles: `${NAV_ROOT}principles/`,
  patterns: `${NAV_ROOT}patterns/`
};

