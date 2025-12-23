import { environment } from "../../../../environments/environment";
import { appletsSpikesConstantsResources } from "../../../spike/constants/implementations/app.lets.spikes.constants.resources";
import { TAppletsSystemsConstants } from "../t.app.lets.systems.constants";
import { appletsSystemsConstantsApis } from "./app.lets.systems.constants.apis";
import { appletsSystemsConstantsAssets } from "./app.lets.systems.constants.assets";

const NAME = 'System'

  export const appletsSystemsConstants : TAppletsSystemsConstants = {
    id: NAME,
    environment: environment,
    assets: appletsSystemsConstantsAssets,
    apis: appletsSystemsConstantsApis,
    resources: appletsSpikesConstantsResources

  }

