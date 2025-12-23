import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TAppletsEducationConstantsAssets } from "../t.app.lets.education.constants.assets";
import { PATHFRAGMENT } from "../app.lets.education.constants.name";

// Use PATHFRAGMENT for asset paths (keeps slashes for filesystem)
const ASSETS_DEPLOYED = StringService.replaceTemplate(environment.custom.urls.assets.deployed, PATHFRAGMENT);
const RESOURCES_OPEN = StringService.replaceTemplate(environment.custom.urls.media.open, PATHFRAGMENT);
const RESOURCES_SENSITIVE = StringService.replaceTemplate(environment.custom.urls.media.sensitive, PATHFRAGMENT);

export const appletsEducationConstantsAssets: TAppletsEducationConstantsAssets = {
  root: `${ASSETS_DEPLOYED}`,
  i18n: `${ASSETS_DEPLOYED}i18n/`,
  images: {
    root: `${ASSETS_DEPLOYED}images/`,
    recordTypes: `${RESOURCES_OPEN}images/recordTypes/`,
  }
}

