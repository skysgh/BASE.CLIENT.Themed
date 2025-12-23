import { NAME } from '../t.core.constants';
import { environment } from "../../../environments/environment";
import { StringService } from "../../services/string.service";
import { TCoreConstantsAssets } from "../t.core.constants.assets";


// Private root of the API:
const ASSETS_OPEN = StringService.replaceTemplate(environment.custom.urls.assets.deployed, NAME.toLowerCase());


export const coreConstantsAssets: TCoreConstantsAssets = {
  /** Paths to publicly accessible resources that are not sensitive
   *  (ie do not contain PII, etc.)
   */
  root: `${ASSETS_OPEN}`,
  i18n: `${ASSETS_OPEN}i18n/`,
  /** While I can't think yet of too many resources that are universal,
   * try to move as many resources as posisble to this area so that
   * they are available to all themes and sites.
   */
  images: {
    root: `${ASSETS_OPEN}images/`,
    recordTypes: `${ASSETS_OPEN}images/recordTypes/`,
    flags: `${ASSETS_OPEN}images/flags/`
  },
}
