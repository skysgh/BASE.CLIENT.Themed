
import { appletsTemplateConstants, NAME as name} from "../../constants/implementations/app.lets.template.constants";
import { appletsTemplateConfigurationOthers } from "./app.lets.template.configuration.others";
import { appletsTemplateConfigurationNavigation } from "./app.lets.template.configuration.navigation";
import { TAppletsTemplateConfiguration } from "../t.app.lets.template.configuration";

const NAME = name;

export const appletsTemplateConfiguration: TAppletsTemplateConfiguration = {

  constants: appletsTemplateConstants,

  navigation: appletsTemplateConfigurationNavigation,

  others: appletsTemplateConfigurationOthers

}
