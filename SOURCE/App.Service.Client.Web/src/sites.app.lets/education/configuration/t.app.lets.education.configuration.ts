import { TBaseConfiguration } from "../../../core/base/configuration/t.base.configuration";
import { TAppletsEducationConstants } from "../constants/t.app.lets.education.constants";
import { TAppletsEducationConfigurationOthers } from "./t.app.lets.education.configufation.others";
import { TAppletsEducationConfigurationNavigation } from "./t.app.lets.education.configuration.navigation";

export type TAppletsEducationConfiguration = TBaseConfiguration & {

  navigation: TAppletsEducationConfigurationNavigation,

  others: TAppletsEducationConfigurationOthers

  constants: TAppletsEducationConstants,
}
