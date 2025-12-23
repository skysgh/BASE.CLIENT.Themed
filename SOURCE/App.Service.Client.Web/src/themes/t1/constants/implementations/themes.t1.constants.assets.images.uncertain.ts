import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TThemesT1ConstantsAssetsImagesUncertain } from "../t.themes.t1.constants.assets.images.uncertain";


const NAME = 'Themes/T1';
const ASSETS_OPEN = StringService.replaceTemplate(environment.custom.urls.assets.deployed, NAME);
const ROOT_URL = `${ASSETS_OPEN}images/uncertain/`;

export const themesT1ConstantsAssetsImagesUncertain: TThemesT1ConstantsAssetsImagesUncertain = {
  root: `${ROOT_URL}`,

  brands: `${ROOT_URL}brands/`,
  galaxy: `${ROOT_URL}galaxy/`,
  small: `${ROOT_URL}small/`,
  svg: `${ROOT_URL}svg/`,
  sweetalerts: `${ROOT_URL}sweetalerts/`,
  clients: `${ROOT_URL}clients/`,
};
