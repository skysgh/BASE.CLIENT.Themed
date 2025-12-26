import { environment } from "../../../../environments/environment";

import { StringService } from "../../../../core/services/string.service";

import { appletsEducationConfigurationNavigation } from "./app.lets.education.configuration.navigation";
import { appletsEducationConfigurationOthers } from "./app.lets.education.configuration.others";
import { TAppletsEducationConfiguration } from "../t.app.lets.education.configuration";
import { appletsEducationConstants } from "../../constants/implementations/app.lets.education.constants";

export const appletsEducationConfiguration : TAppletsEducationConfiguration = {

  constants: appletsEducationConstants,

  navigation: appletsEducationConfigurationNavigation,

  others: appletsEducationConfigurationOthers
}
