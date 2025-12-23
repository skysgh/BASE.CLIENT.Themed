// Hate magic like this, but can't see more practical way right now

import { environment } from "../../../environments/environment";

import { TCoreConstants, NAME} from "../t.core.constants";
import { coreConstantsApis } from "./core.constants.apis";
//
import { coreConstantsAssets } from "./core.constants.assets";
import { coreConstantsResources } from "./core.constants.resources";
import { coreConstantsStorage } from "./core.constants.storage";
import { coreConstantsUuid } from "./core.constants.uuid";

export { NAME }


export const coreConstants : TCoreConstants  = {

  id: NAME,

  /**
   * Default UUID values (empty, etc.).
   */
  uuid: coreConstantsUuid,

  /**
   * Constants related to storage
   * in one or more different storage solutions
   * (db, sessionStorage, cookies, etc.)
   */
  storage: coreConstantsStorage,

  /**
   * None yet. but maybe some of the
   * Token names will turn out to be cookie names.
   * 
   */

  /** API Routes */
  apis: coreConstantsApis,

  /** Assets */
  assets: coreConstantsAssets,


  //  //stats: systemStats,

  environment: environment,

  resources: coreConstantsResources
};
