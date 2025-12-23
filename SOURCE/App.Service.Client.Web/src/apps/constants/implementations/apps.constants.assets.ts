import { NAME } from "../apps.constants.name";
import { StringService } from "../../../core/services/string.service";
import { environment } from "../../../environments/environment";
import { TAppsConstantsAssets } from "../t.apps.constants.assets";

// Private root of the API:

const OPEN_STATIC = StringService.replaceTemplate(environment.custom.urls.assets.deployed, NAME.toLowerCase());

// Assets common to all apps, that
// are specific to apps (and broader, and therefore
// in an underlying App, Site, Theme)
export const appsConstantsAssets: TAppsConstantsAssets = {
  root: `${OPEN_STATIC}`,
  i18n: `${OPEN_STATIC}i18n/`,
  images: {
    root: `${OPEN_STATIC}images/`,
    favIcons: `${OPEN_STATIC}images/favIcons/`,
    recordTypes: `${OPEN_STATIC}images/recordTypes/`,
  }
}


