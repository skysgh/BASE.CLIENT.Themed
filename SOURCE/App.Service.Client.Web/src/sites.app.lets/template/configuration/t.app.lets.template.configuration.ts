import { TBaseConfiguration } from "../../../core/base/configuration/t.base.configuration";
import { TAppletsTemplateConstants } from "../constants/t.app.lets.template.constants";
import { TAppletsTemplateConfigurationOthers } from "./t.app.lets.template.configufation.others";
import { TAppletsTemplateConfigurationNavigation } from "./t.app.lets.template.configuration.navigation";

export type TAppletsTemplateConfiguration = TBaseConfiguration & {

  navigation: TAppletsTemplateConfigurationNavigation,
  others: TAppletsTemplateConfigurationOthers
  constants: TAppletsTemplateConstants,
}
