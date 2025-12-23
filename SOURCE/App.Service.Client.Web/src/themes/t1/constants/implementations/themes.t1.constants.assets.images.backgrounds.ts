import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TThemesT1ConstantsAssetsImagesBackgrounds } from "../t.themes.t1.constants.assets.images.backgrounds";



const NAME = 'Themes/T1';
const ASSETS_OPEN = StringService.replaceTemplate(environment.custom.urls.assets.deployed, NAME);
const ROOT_URL = `${ASSETS_OPEN}images/backgrounds/`; 

export const themesT1ConstantsAssetsImagesBackgrounds: TThemesT1ConstantsAssetsImagesBackgrounds = {
  root: `${ ROOT_URL }`,

  sidebars: `${ROOT_URL}sidebars/`,
  tops: `${ROOT_URL}tops/`
};


