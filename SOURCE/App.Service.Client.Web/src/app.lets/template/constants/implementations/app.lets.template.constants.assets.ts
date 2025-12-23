import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TAppletsTemplateConstantsAssets } from "../t.app.lets.template.constants.assets";
import { PATHFRAGMENT } from "../app.lets.template.constants.name";

const ASSETS_DEPLOYED = StringService.replaceTemplate(environment.custom.urls.assets.deployed, PATHFRAGMENT);
const RESOURCES_OPEN = StringService.replaceTemplate(environment.custom.urls.media.open, PATHFRAGMENT);
const RESOURCES_SENSITIVE = StringService.replaceTemplate(environment.custom.urls.media.sensitive, PATHFRAGMENT);

export const appletsTemplateConstantsAssets: TAppletsTemplateConstantsAssets = {

  root: `${ASSETS_DEPLOYED}`,
  i18n: `${ASSETS_DEPLOYED}i18n/`,
  images: {
    root: `${ASSETS_DEPLOYED}images/`,
    recordTypes: `${RESOURCES_OPEN}images/recordTypes/`,
  }

}

