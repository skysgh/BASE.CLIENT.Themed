import { TBaseConfiguration } from "../../core/base/configuration/t.base.configuration";
import { TAppletsArchitectureConstants } from "../architecture/constants/t.app.lets.architecture.constants";
import { TAppletsConfigurationNavigation } from "./t.app.lets.configuration.navigation";
import { TAppletsConfigurationOthers } from "./t.app.lets.configuration.others";



export type TAppletsConfiguration = TBaseConfiguration & {


  constants: TAppletsArchitectureConstants,
  navigation: TAppletsConfigurationNavigation,
  others: TAppletsConfigurationOthers

}

