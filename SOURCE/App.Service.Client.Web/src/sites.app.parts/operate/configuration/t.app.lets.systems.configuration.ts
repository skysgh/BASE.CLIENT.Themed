import { TBaseConfiguration } from "../../../core/base/configuration/t.base.configuration";
import { TAppletsSystemsConstants } from "../constants/t.app.lets.systems.constants";
import { TAppletsSystemsConfigurationOthers } from "./t.app.lets.systems.configuration.others";
import { TAppletsSystemsConfigurationNavigation } from "./t.app.lets.systems.configuration.navigation";

export type TAppletsSystemsConfiguration = TBaseConfiguration & {

  navigation: TAppletsSystemsConfigurationNavigation,
  others: TAppletsSystemsConfigurationOthers
  constants: TAppletsSystemsConstants,
}
