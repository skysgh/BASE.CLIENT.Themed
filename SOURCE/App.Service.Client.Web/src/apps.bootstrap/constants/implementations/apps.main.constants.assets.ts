import { NAME } from "../apps.main.constants.name";
import { StringService } from "../../../core/services/string.service";
import { environment } from "../../../environments/environment";
import { TAppsMainConstantsAssets } from "../t.apps.main.constants.assets";

const OPEN_STATIC = StringService.replaceTemplate(environment.custom.urls.assets.deployed, NAME.toLowerCase());

export const appsMainConstantsAssets: TAppsMainConstantsAssets = {
  root: `${OPEN_STATIC}`,
  i18n: `${OPEN_STATIC}i18n/`,
  images: {
    root: `${OPEN_STATIC}images/`,
    favIcons: `${OPEN_STATIC}images/favIcons/`,
    recordTypes: `${OPEN_STATIC}images/recordTypes/`,
  }
}
