import { TBaseConfiguration } from "../../../core/base/configuration/t.base.configuration";
import { TAppletsDemosConstants } from "../constants/t.app.lets.demos.constants";
import { TAppletsDemosConfigurationOthers } from "./t.app.lets.demos.configufation.others";
import { TAppletsDemosConfigurationNavigation } from "./t.app.lets.demos.configuration.navigation";

export type TAppletsDemosConfiguration = TBaseConfiguration & {

  navigation: TAppletsDemosConfigurationNavigation,
  others: TAppletsDemosConfigurationOthers
  constants: TAppletsDemosConstants,
}
