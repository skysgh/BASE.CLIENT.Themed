import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TThemesT1ConstantsAssetsImagesUnused } from "../t.themes.t1.constants.assets.images.unused";


const NAME = 'themes/t1';
const ASSETS_DEPLOYED = StringService.replaceTemplate(environment.custom.urls.assets.deployed, NAME);
const ROOT_URL = `${ASSETS_DEPLOYED}images/unused/`;

export const themesT1ConstantsAssetsImagesUnused: TThemesT1ConstantsAssetsImagesUnused = {
  root: `${ROOT_URL}`,

  nft: `${ROOT_URL}nft/`,
  nft_gif: `${ROOT_URL}nft/gif/`,
  nft_wallet: `${ROOT_URL}nft/wallet/`,
}
