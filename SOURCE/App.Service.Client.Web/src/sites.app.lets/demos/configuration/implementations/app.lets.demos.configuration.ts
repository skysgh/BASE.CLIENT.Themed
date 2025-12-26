import { environment } from "../../../../environments/environment";

import { StringService } from "../../../../core/services/string.service";

import { appletsDemosConstants } from "../../constants/implementations/app.lets.demos.constants";
import { appletsDemosConfigurationNavigation } from "./app.lets.demos.configuration.navigation";
import { appletsDemoConfigurationOthers } from "./app.lets.configuration.others";
import { TAppletsDemosConfiguration } from "../t.app.lets.demos.configuration";

const DEMO = 'Demos';

export const appletsDemosConfiguration : TAppletsDemosConfiguration = {

  constants: appletsDemosConstants,

  navigation: appletsDemosConfigurationNavigation,

  others: appletsDemoConfigurationOthers

}
