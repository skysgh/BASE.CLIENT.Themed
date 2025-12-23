import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TThemesT1ConstantsAssets } from "../t.themes.t1.constants.assets";
import { themesT1ConstantsAssetsImages } from "./themes.t1.constants.assets.images";

// Theme assets are copied to /assets/ root (not /assets/themes/t1/) for vendor compatibility
const NAME = '';
const ASSETS_DEPLOYED = StringService.replaceTemplate(environment.custom.urls.assets.deployed, NAME);

export const themesT1ConstantsAssets: TThemesT1ConstantsAssets = {

  root: `${ASSETS_DEPLOYED}`,

  fonts: `${ASSETS_DEPLOYED}fonts/`,

  i18n: `${ASSETS_DEPLOYED}i18n/`,

  /**
   * Only used during compilation.
   */
  scss: `${ASSETS_DEPLOYED}scss/`,

  images: themesT1ConstantsAssetsImages

}

