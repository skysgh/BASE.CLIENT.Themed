import { environment } from "../../../../environments/environment";
// Note: spike is a domain applet in sites.app.lets, referencing from platform applet
// TODO: Consider creating operate-specific resources or moving shared resources to core
import { appletsSpikesConstantsResources } from "../../../../sites.app.lets/spike/constants/implementations/app.lets.spikes.constants.resources";
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

