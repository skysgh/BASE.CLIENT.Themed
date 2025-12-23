import { TBaseConstants } from "../../../core/base/constants/t.base.constants";
import { TThemesT1ConstantsApis } from "./t.themes.t1.constants.apis";
import { TThemesT1ConstantsAssets } from "./t.themes.t1.constants.assets";
import { TThemesT1ConstantsResources } from "./t.themes.t1.constants.resources";

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
