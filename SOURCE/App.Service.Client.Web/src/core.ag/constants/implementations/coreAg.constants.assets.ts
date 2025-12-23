import { NAME } from '../t.coreAg.constants'

import { StringService } from "../../../core/services/string.service";
import { environment } from "../../../environments/environment";
import { TCoreAgConstantsAssets } from "../t.coreAg.constants.assets";

const ASSETS_OPEN =
  StringService.replaceTemplate(
    environment.custom.urls.assets.deployed,
    NAME.toLowerCase());

export const coreAgConstantsAssets: TCoreAgConstantsAssets = {
  root: `${ASSETS_OPEN}`,
  images: {
    root: `${ASSETS_OPEN}images/`,
    recordTypes: `${ASSETS_OPEN}images/recordTypes/`,
  }
}
