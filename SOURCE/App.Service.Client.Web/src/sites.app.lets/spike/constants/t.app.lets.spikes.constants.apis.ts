import { TBaseConstantsApis } from "../../../core/base/constants/t.base.constants.apis";

export type TAppletsSpikesConstantsApis = TBaseConstantsApis & {

  /** Spikes collection endpoint */
  spike: string,

  /** SubSpikes collection endpoint (named 'spikes' for legacy but represents sub-spikes) */
  spikes: string,

  /** Alias for subSpikes - clearer naming */
  subSpikes?: string,

};
