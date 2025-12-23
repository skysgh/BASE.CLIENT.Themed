import { TBaseConstants } from "../../core/base/constants/t.base.constants";
import { TCoreAgConstantsApis } from "./t.coreAg.constants.apis";
import { TCoreAgConstantsAssets } from "./t.coreAg.constants.assets";
import { TCoreAgConstantsResources } from "./t.coreAg.constants.resources";

export const NAME = 'CoreAg';

export type TCoreAgConstants = TBaseConstants & {
  apis: TCoreAgConstantsApis,
  assets: TCoreAgConstantsAssets,
  resources: TCoreAgConstantsResources
}
