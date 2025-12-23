import { appletsConstantsAssets } from "./app.lets.constants.assets";
import { appletsConstantsApis } from "./app.lets.configuration.apis";
import { environment } from "../../../environments/environment";
import { TAppletsConstants } from "../t.app.lets.constants";
import { appletsConstantsResources } from "./app.lets.constants.resources";

const NAME = 'Applets';

export const appletsConstants : TAppletsConstants = {
  id: NAME,

    // Note that it doesn't insert the id (only individual applets do):
  apis: appletsConstantsApis,

  // Note that it doesn't insert the id (only individual applets do):
  assets: appletsConstantsAssets,

  /** Direct access to Applets immutable environment configuration */
  environment: environment,

  resources: appletsConstantsResources
};

