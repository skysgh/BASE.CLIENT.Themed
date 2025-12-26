import { environment } from "../../../../environments/environment";

import { appletsDemosConstantsApis } from "./app.lets.demos.constants.apis";
import { appletsDemosConstantsAssets } from "./app.lets.demos.constants.assets";
import { TAppletsArchitectureConstants } from "../../../architecture/constants/t.app.lets.architecture.constants";
import { appletsDemosConstantsResources } from "./app.lets.demos.constants.resources";

const NAME = 'Demos';

export const appletsDemosConstants : TAppletsArchitectureConstants = {
  id: NAME,

  apis: appletsDemosConstantsApis,

  assets: appletsDemosConstantsAssets,

  environment: environment,

  resources: appletsDemosConstantsResources
}

