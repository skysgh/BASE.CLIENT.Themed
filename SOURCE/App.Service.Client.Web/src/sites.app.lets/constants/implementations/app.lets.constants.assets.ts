import { StringService } from "../../../core/services/string.service";
import { environment } from "../../../environments/environment";
import { TAppletsConstantsAssets } from "../t.app.lets.constants.assets";

// Private root of the API:
const NAME = 'Applets';
const ASSETS_OPEN = StringService.replaceTemplate(environment.custom.urls.assets.deployed, NAME);

export const appletsConstantsAssets: TAppletsConstantsAssets = {

  root: `${ASSETS_OPEN}`,
  i18n:'N/A',
  images: {
    root: 'N/A',
    //recordTypes:'N/A'
  }
}
