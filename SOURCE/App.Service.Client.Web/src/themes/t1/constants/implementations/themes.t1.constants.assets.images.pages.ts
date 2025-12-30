import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TThemesT1ConstantsAssetsImagesPages } from "../t.themes.t1.constants.assets.images.pages";


const NAME = 'Themes/T1';
const ASSETS_OPEN = StringService.replaceTemplate(environment.custom.urls.assets.deployed, NAME);
const ROOT_URL = `${ASSETS_OPEN}images/pages/`;


export const themesT1ConstantsAssetsImagesPages: TThemesT1ConstantsAssetsImagesPages = {
  root: `${ROOT_URL}`,

  comingsoon: `${ROOT_URL}comingsoon/`,
  maintainance: `${ROOT_URL}maintainance/`,
  errors: `${ROOT_URL}errors/`,


  about: `TODO`

}


