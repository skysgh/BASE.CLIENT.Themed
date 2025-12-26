import { TBaseConfiguration } from "../../../core/base/configuration/t.base.configuration";
import { TAppletsArchitectureConstants } from "../constants/t.app.lets.architecture.constants";
import { TAppletsArchitectureConfigurationOthers } from "./t.app.lets.architecture.configufation.others";
import { TAppletsArchitectureConfigurationNavigation } from "./t.app.lets.architecture.configuration.navigation";

export type TAppletsArchitectureConfiguration = TBaseConfiguration & {

  constants: TAppletsArchitectureConstants,

  navigation: TAppletsArchitectureConfigurationNavigation,

  others: TAppletsArchitectureConfigurationOthers

}
