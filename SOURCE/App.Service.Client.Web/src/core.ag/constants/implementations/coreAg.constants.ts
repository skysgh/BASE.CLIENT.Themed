import { NAME } from '../t.coreAg.constants'

import { environment } from "../../../environments/environment";
import { TCoreAgConstants } from "../t.coreAg.constants";
import { coreAgConstantsApis } from "./coreAg.constants.apis";
import { coreAgConstantsAssets } from "./coreAg.constants.assets";
import { coreAgConstantsResources } from "./coreAg.constants.resources";


export const coreAgConstants: TCoreAgConstants = {
  id: NAME,
  /**
 * Assets specifc to CoreAg:
 */
  assets: coreAgConstantsAssets,
  /**
   * API routes specific to CoreAg (probably none)
   */
  apis: coreAgConstantsApis,

  environment: environment,

  resources: coreAgConstantsResources
};
