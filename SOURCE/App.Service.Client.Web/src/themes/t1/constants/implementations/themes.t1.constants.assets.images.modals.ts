import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TThemesT1ConstantsAssetsImagesModals } from "../t.themes.t1.constants.assets.images.modals";


const NAME = 'Themes/T1';
const ASSETS_OPEN = StringService.replaceTemplate(environment.custom.urls.assets.deployed, NAME);
const ROOT_URL = `${ASSETS_OPEN}images/modals/`;


export const themesT1ConstantsAssetsImagesModals: TThemesT1ConstantsAssetsImagesModals = {
  root: `${ROOT_URL}`,
}
