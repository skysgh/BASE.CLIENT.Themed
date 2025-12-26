import { TBaseConfiguration } from "../../../core/base/configuration/t.base.configuration";
import { TAppletsSpikesConstants } from "../constants/t.app.lets.spikes.constants";
import { TAppletsSpikesConfigurationOthers } from "./t.app.lets.spikes.configuration.others";
import { TAppletsSpikesConfigurationNavigation } from "./t.app.lets.spikes.configuration.navigation";

export type TAppletsSpikesConfiguration = TBaseConfiguration & {

  navigation: TAppletsSpikesConfigurationNavigation,
  others: TAppletsSpikesConfigurationOthers
  constants: TAppletsSpikesConstants,
}
