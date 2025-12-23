import { TBaseConstants } from "../../../core/base/constants/t.base.constants"
import { TAppletsSpikesConstantsApis } from "./t.app.lets.spikes.constants.apis"
import { TAppletsSpikesConstantsAssets } from "./t.app.lets.spikes.constants.assets"
import { TAppletsSpikesConstantsResources } from "./t.app.lets.spikes.constants.resources"

export type TAppletsSpikesConstants = TBaseConstants & {

  apis: TAppletsSpikesConstantsApis,
  assets: TAppletsSpikesConstantsAssets,
  resources: TAppletsSpikesConstantsResources
}

