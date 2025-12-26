import { environment } from "../../../../environments/environment";

import { appletsSpikesConstantsApis } from "./app.lets.spikes.constants.apis";
import { appletsSpikesConstantsAssets } from "./app.lets.spikes.constants.assets";
import { TAppletsSpikesConstants } from "../t.app.lets.spikes.constants";
import { appletsSpikesConstantsResources } from "./app.lets.spikes.constants.resources";

const NAME = 'Spikes';

export const appletsSpikesConstants: TAppletsSpikesConstants = {

  id: NAME,

  apis: appletsSpikesConstantsApis,

  assets: appletsSpikesConstantsAssets,

  environment: environment,

  resources: appletsSpikesConstantsResources

};


