import { TBaseConstants } from "../../../core/base/constants/t.base.constants";
import { TThemesT1ConstantsApis } from "./t.themes.t1.constants.apis";
import { TThemesT1ConstantsAssets } from "./t.themes.t1.constants.assets";
import { TThemesT1ConstantsResources } from "./t.themes.t1.constants.resources";

/**
 * Display name for Themes.T1 tier
 */
export const NAME = 'Themes.T1';

/**
 * Machine file path (with trailing slash)
 * Note: Nested path since themes/t1/ is the actual folder structure
 * ✅ Example: `${ROOT_RELATIVE_PATH}assets` → "themes/t1/assets"
 */
export const ROOT_RELATIVE_PATH = 'themes/t1/';  // ✅ Trailing slash!

export type TThemesT1Constants = TBaseConstants & {

  /**
   *
   * An override
   */
  apis: TThemesT1ConstantsApis,

  /**
   * 
   * An override
   */
  assets: TThemesT1ConstantsAssets,

  resources: TThemesT1ConstantsResources,

}
