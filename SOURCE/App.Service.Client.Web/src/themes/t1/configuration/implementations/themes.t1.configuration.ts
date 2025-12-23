import { environment } from "../../../../environments/environment";

import { StringService } from "../../../../core/services/string.service";

import { themesT1Constants } from "../../constants/implementations/themes.t1.constants";

import { ThemesT1ConfigurationType } from "../contracts/t.themes.t1.configuration.type______________";
import { themesT1ConfigurationNavigation } from "./themes.t1.configuration.navigation";
import { themesT1ConfigurationOthers } from "./themes.t1.configuration.others";
import { TThemesT1Configuration } from "../t.themes.t1.configuration";

const ROOT_THEMES_T1 = 'Themes/T1'
/**
 * Constants specific to this theme.
 */

export const NAV_ROOT = StringService.replaceTemplate(environment.custom.urls.navigation.root, '');

export const themesT1Configuration: TThemesT1Configuration /*: ThemesT1ConfigurationType*/ = {

  description: 'Began as Velzone',

  constants: themesT1Constants,

  navigation: themesT1ConfigurationNavigation,

  others: themesT1ConfigurationOthers
}


