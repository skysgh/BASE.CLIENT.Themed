import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TAppletsTransactionsConstantsAssets } from "../t.app.lets.transactions.constants.assets";
import { PATHFRAGMENT } from "../app.lets.transactions.constants.name";

const ASSETS_DEPLOYED = StringService.replaceTemplate(environment.custom.urls.assets.deployed, PATHFRAGMENT);
const RESOURCES_OPEN = StringService.replaceTemplate(environment.custom.urls.media.open, PATHFRAGMENT);
const RESOURCES_SENSITIVE = StringService.replaceTemplate(environment.custom.urls.media.sensitive, PATHFRAGMENT);

export const appletsTransactionsConstantsAssets : TAppletsTransactionsConstantsAssets = {
      root: `${ASSETS_DEPLOYED}`,
      i18n: `${ASSETS_DEPLOYED}i18n/`,
      images: {
        root: `${ASSETS_DEPLOYED}images/`,
        recordTypes: `${RESOURCES_OPEN}images/recordTypes/`,
      },
};
