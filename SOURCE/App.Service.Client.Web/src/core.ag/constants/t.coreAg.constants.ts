import { TBaseConstants } from "../../core/base/constants/t.base.constants";
import { TCoreAgConstantsApis } from "./t.coreAg.constants.apis";
import { TCoreAgConstantsAssets } from "./t.coreAg.constants.assets";
import { TCoreAgConstantsResources } from "./t.coreAg.constants.resources";

/**
 * Display name for Core.Ag tier
 */
export const NAME = 'Core.Ag';

/**
 * Machine file path (with trailing slash)
 * ✅ Example: `${ROOT_RELATIVE_PATH}assets` → "core.ag/assets"
 */
export const ROOT_RELATIVE_PATH = 'core.ag/';  // ✅ Trailing slash!

export type TCoreAgConstants = TBaseConstants & {
  apis: TCoreAgConstantsApis,
  assets: TCoreAgConstantsAssets,
  resources: TCoreAgConstantsResources
}
