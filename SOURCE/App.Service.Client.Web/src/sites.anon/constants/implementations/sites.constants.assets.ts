import { NAME } from "../t.sites.constants";

import { StringService } from "../../../core/services/string.service";
import { environment } from "../../../environments/environment";
import { TSitesConstantsAssets } from "../t.sites.constants.assets";

const ASSETS_OPEN = StringService.replaceTemplate(environment.custom.urls.assets.deployed, NAME.toLowerCase());

export const sitesConstantsAssets: TSitesConstantsAssets = {
  root: `${ASSETS_OPEN}`,

  i18n: `${ASSETS_OPEN}i18n/`,

  images: {
    root: `${ASSETS_OPEN}images/`,
    faq: `${ASSETS_OPEN}images/pages/faq/`,
    maintenance: `${ASSETS_OPEN}images/pages/maintenance/`,
    pages: {
      root: `${ASSETS_OPEN}images/pages/`,
      home: {
        root: `${ASSETS_OPEN}images/pages/home/`,
        demos: `${ASSETS_OPEN}images/pages/home/demos/`,
        features: `${ASSETS_OPEN}images/pages/home/features/`,
        intro: `${ASSETS_OPEN}images/pages/home/intro/`,
        trustedBy: `${ASSETS_OPEN}images/pages/home/trustedBy/`,
      },
    },
    recordTypes: `${ASSETS_OPEN}images/recordTypes/`,
    users: `${ASSETS_OPEN}images/users/`,
  }
}
