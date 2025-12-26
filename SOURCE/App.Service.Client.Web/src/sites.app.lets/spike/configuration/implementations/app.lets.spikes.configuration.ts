import { environment } from "../../../../environments/environment";

import { appletsSpikesConfigurationNavigation } from "./app.lets.spikes.configuration.navigation";
import { appletsSpikesConstants } from "../../constants/implementations/app.lets.spikes.constants";
import { appletsSpikesConfigurationOthers } from "./app.lets.spikes.configuration.others";
import { TAppletsSpikesConfiguration } from "../t.app.lets.spikes.configuration";

const NAME = 'Spikes'

export const appletsSpikesConfiguration: TAppletsSpikesConfiguration = {

  /**
   * Direct access to constants:
   */
  constants: appletsSpikesConstants,

  /**
   * Routes are provided by default.
   * But they can be overridden at startup
   * if/as required.
   */
  navigation: appletsSpikesConfigurationNavigation,

  others: appletsSpikesConfigurationOthers
}
