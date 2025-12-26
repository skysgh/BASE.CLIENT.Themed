import { environment } from "../../../../environments/environment";

// Hate magic like this, but can't see more practical way right now
import { StringService } from "../../../../core/services/string.service";
//
import { appletsArchitectureConstants } from "../../constants/implementations/app.lets.architecture.constants"
import { appletsArchitectureConfigurationNavigation } from "./app.lets.architecture.configuration.navigation"
import { TAppletsArchitectureConfiguration } from "../t.app.lets.architecture.configuration";
import { appletsArchitectureConfigurationOthers } from "./app.lets.architecture.configuration.others";
import { appletsConfigurationOthers } from "../../../configuration/implementations/app.lets.configuration.others";



const NAME = 'Architecture';

export const appletsArchitectureConfiguration : TAppletsArchitectureConfiguration = {
  ...appletsArchitectureConstants, appletsArchitectureConfigurationOthers,

  constants: appletsArchitectureConstants,

  navigation: appletsArchitectureConfigurationNavigation,

  others: appletsConfigurationOthers
};


