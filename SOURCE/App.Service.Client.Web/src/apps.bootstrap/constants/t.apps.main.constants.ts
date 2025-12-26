import { TBaseConstants } from "../../core/base/constants/t.base.constants";
import { TAppsMainConstantsApis } from "./t.apps.main.constants.apis";
import { TAppsMainConstantsAssets } from "./t.apps.main.constants.assets";
import { TAppsMainConstantsResources } from "./t.apps.main.constants.resources";

export const NAME = 'Apps.Main';

export type TAppsMainConstants = TBaseConstants & {
  apis: TAppsMainConstantsApis,
  assets: TAppsMainConstantsAssets,
  resources: TAppsMainConstantsResources
}
