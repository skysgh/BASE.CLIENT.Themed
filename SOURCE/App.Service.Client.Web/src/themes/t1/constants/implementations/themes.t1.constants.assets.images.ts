import { TThemesT1ConstantsAssetsImages } from "../t.themes.t1.constants.assets.images";
import { themesT1ConstantsAssetsImagesBackgrounds } from "./themes.t1.constants.assets.images.backgrounds";
import { themesT1ConstantsAssetsImagesPages } from "./themes.t1.constants.assets.images.pages";
import { themesT1ConstantsAssetsImagesModals } from "./themes.t1.constants.assets.images.modals";
import { themesT1ConstantsAssetsImagesUncertain } from "./themes.t1.constants.assets.images.uncertain";
import { themesT1ConstantsAssetsImagesLayouts } from "./themes.t1.constants.assets.images.layouts";
import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { themesT1ConstantsAssetsImagesUnused } from "./themes.t1.constants.assets.images.unused";


const NAME = 'Themes/T1';
const ASSETS_OPEN = StringService.replaceTemplate(environment.custom.urls.assets.deployed, NAME);
const ROOT_URL = `${ASSETS_OPEN}images/`;


export const themesT1ConstantsAssetsImages: TThemesT1ConstantsAssetsImages = {

  root: `${ROOT_URL}`,

  recordTypes: `${ROOT_URL}recordTypes/`,

  layouts:     themesT1ConstantsAssetsImagesLayouts,
  backgrounds: themesT1ConstantsAssetsImagesBackgrounds,
  modals:      themesT1ConstantsAssetsImagesModals,
  pages:       themesT1ConstantsAssetsImagesPages,
  uncertain:   themesT1ConstantsAssetsImagesUncertain,
  unused :     themesT1ConstantsAssetsImagesUnused
}

