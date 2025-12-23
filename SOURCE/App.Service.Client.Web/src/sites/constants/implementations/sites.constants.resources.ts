import { NAME, PATHFRAGMENT } from "../sites.constants.name";

import { StringService } from "../../../core/services/string.service";
import { environment } from "../../../environments/environment";
import { TSitesConstantsResources } from "../t.sites.constants.resources";

// Use PATHFRAGMENT for asset paths
const RESOURCES_OPEN = StringService.replaceTemplate(environment.custom.urls.media.open, PATHFRAGMENT);
const RESOURCES_SENSITIVE = StringService.replaceTemplate(environment.custom.urls.media.sensitive, PATHFRAGMENT);

export const sitesConstantsResources: TSitesConstantsResources = {
  open: {
    root: `${RESOURCES_OPEN}`,
    images: {
      root: `${RESOURCES_OPEN}images/`,
      companies: `${RESOURCES_OPEN}images/companies`,
      products: `${RESOURCES_OPEN}images/products`,
      recordTypes: `${RESOURCES_OPEN}images/records`,
    },
    files: {
      root: `${RESOURCES_OPEN}files/`,
      markdown: `${RESOURCES_OPEN}files/markdown/`,
      pdf: `${RESOURCES_OPEN}files/pdf/`,
    },
  },
  sensitive: {
    root: `${RESOURCES_SENSITIVE}`,
    images: {
      root: `${RESOURCES_SENSITIVE}images/`,
      users: `${RESOURCES_SENSITIVE}images/users/`
    }
  }
}
