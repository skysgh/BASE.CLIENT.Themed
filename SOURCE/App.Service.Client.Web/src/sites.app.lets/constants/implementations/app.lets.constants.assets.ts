import { StringService } from "../../../core/services/string.service";
import { environment } from "../../../environments/environment";
import { TAppletsConstantsAssets } from "../t.app.lets.constants.assets";

/**
 * ✅ UPDATED after tier restructuring:
 * - Old path: 'Applets' → /assets/applets/...
 * - New path: 'sites.app.lets' → /assets/sites.app.lets/...
 *
 * Note: Individual applets (education, spike) may have their own sub-paths
 * like /assets/sites.app.lets/education/...
 */
const NAME = 'sites.app.lets';
const ASSETS_OPEN = StringService.replaceTemplate(environment.custom.urls.assets.deployed, NAME);

export const appletsConstantsAssets: TAppletsConstantsAssets = {

  root: `${ASSETS_OPEN}`,
  i18n:'N/A',
  images: {
    root: 'N/A',
    //recordTypes:'N/A'
  }
}
