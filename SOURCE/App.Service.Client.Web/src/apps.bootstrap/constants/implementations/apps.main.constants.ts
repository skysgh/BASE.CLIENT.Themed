import { environment } from "../../../environments/environment";
import { TAppsMainConstants, NAME } from "../t.apps.main.constants";
import { appsMainConstantsApis } from "./apps.main.constants.apis";
import { appsMainConstantsAssets } from "./apps.main.constants.assets";
import { appsMainConstantsResources } from "./apps.main.constants.resources";

export const appsMainConstants: TAppsMainConstants = {
  id: NAME,
  apis: appsMainConstantsApis,
  assets: appsMainConstantsAssets,
  resources: appsMainConstantsResources,
  environment: environment
};
