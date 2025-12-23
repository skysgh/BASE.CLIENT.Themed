import { TBaseConstantsAssetsFolder } from "../../../core/base/constants/t.base.constants.assets.folder"
import { TThemesT1ConstantsAssetsImagesBackgrounds } from "./t.themes.t1.constants.assets.images.backgrounds"
import { TThemesT1ConstantsAssetsImagesLayouts } from "./t.themes.t1.constants.assets.images.layouts"
import { TThemesT1ConstantsAssetsImagesModals } from "./t.themes.t1.constants.assets.images.modals"
import { TThemesT1ConstantsAssetsImagesPages } from "./t.themes.t1.constants.assets.images.pages"
import { TThemesT1ConstantsAssetsImagesUncertain } from "./t.themes.t1.constants.assets.images.uncertain"
import { TThemesT1ConstantsAssetsImagesUnused } from "./t.themes.t1.constants.assets.images.unused"


export type TThemesT1ConstantsAssetsImages = TBaseConstantsAssetsFolder & {


  recordTypes: string,

  layouts: TThemesT1ConstantsAssetsImagesLayouts,
  backgrounds: TThemesT1ConstantsAssetsImagesBackgrounds,
  modals: TThemesT1ConstantsAssetsImagesModals,
  pages: TThemesT1ConstantsAssetsImagesPages,
  uncertain: TThemesT1ConstantsAssetsImagesUncertain,
  unused: TThemesT1ConstantsAssetsImagesUnused

}


