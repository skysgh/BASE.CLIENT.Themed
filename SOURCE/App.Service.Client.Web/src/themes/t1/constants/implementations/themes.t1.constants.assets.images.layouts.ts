import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TThemesT1ConstantsAssetsImagesLayouts } from "../t.themes.t1.constants.assets.images.layouts";


const NAME = 'Themes/T1';
const ASSETS_OPEN = StringService.replaceTemplate(environment.custom.urls.assets.deployed, NAME);
const ROOT_URL = `${ASSETS_OPEN}images/layouts/`; 


export const themesT1ConstantsAssetsImagesLayouts: TThemesT1ConstantsAssetsImagesLayouts = {
  root: `${ROOT_URL}`,

};
