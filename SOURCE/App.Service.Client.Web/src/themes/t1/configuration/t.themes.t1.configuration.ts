import { TBaseConfiguration } from "../../../core/base/configuration/t.base.configuration";
import { TThemesT1Constants } from "../constants/t.themes.t1.constants";
import { TThemesT1ConfigurationNavigation } from "./t.themes.t1.configuration.navigation";
import { TThemesT1ConfigurationOthers } from "./t.themes.t1.configuration.others";

export type TThemesT1Configuration = TBaseConfiguration & {

  constants: TThemesT1Constants,

  navigation: TThemesT1ConfigurationNavigation,

  others: TThemesT1ConfigurationOthers
}
