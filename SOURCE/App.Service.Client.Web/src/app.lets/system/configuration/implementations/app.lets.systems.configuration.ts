import { environment } from "../../../../environments/environment";
import { appletsSystemsConstants } from "../../constants/implementations/app.lets.systems.constants";
import { TAppletsSystemsConfiguration } from "../t.app.lets.systems.configuration";
import { appletsSystemsConfigurationNavigation } from "./app.lets.systems.configuration.navigation";
import { appletsSystemsConfigurationOthers } from "./app.lets.systems.configuration.others";

const NAME = 'System'

export const appletsSystemsConfiguration : TAppletsSystemsConfiguration = {

  constants: appletsSystemsConstants,

  navigation: appletsSystemsConfigurationNavigation,

  others: appletsSystemsConfigurationOthers

}
