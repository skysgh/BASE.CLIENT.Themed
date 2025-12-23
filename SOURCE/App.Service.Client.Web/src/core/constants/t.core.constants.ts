import { environment } from "../../environments/environment";
import { TBaseConstants } from "../base/constants/t.base.constants";
import { coreConstantsStorage } from "./implementations/core.constants.storage";
import { coreConstantsUuid } from "./implementations/core.constants.uuid";
import { TCoreConstantsApis } from "./t.core.constants.apis";
import { TCoreConstantsAssets } from "./t.core.constants.assets";
import { TCoreConstantsResources } from "./t.core.constants.resources";

export const NAME = 'Core';

export type TCoreConstants = TBaseConstants & {

  apis: TCoreConstantsApis,

  assets: TCoreConstantsAssets

  resources: TCoreConstantsResources,

  /**
   * Constants related to storage
   * in one or more different storage solutions
   * (db, sessionStorage, cookies, etc.)
   */
  storage: typeof coreConstantsStorage,

  /**
 * Default UUID values (empty, etc.).
 */
  uuid: typeof coreConstantsUuid,

}


