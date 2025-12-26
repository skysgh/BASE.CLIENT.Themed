import { environment } from "../../environments/environment";

import { TBaseConstants } from "../../core/base/constants/t.base.constants";

import { TAppsConstantsAssets } from "./t.apps.constants.assets";
import { TAppsConstantsApis } from "./t.apps.constants.apis";
import { TAppsConstantsResources } from "./t.apps.constants.resources";


/** Apps specific constants */
export type TAppsConstants = TBaseConstants & {

  /** Identifier (not the same as description/title)  */
  id: string;

  /** Apps API routes */
  apis: TAppsConstantsApis;

  /** Apps Assets Assets */
  assets: TAppsConstantsAssets;

  resources: TAppsConstantsResources,

  /** System Environment */
  environment: typeof environment;
}

