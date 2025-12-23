//import { ISystemSystemStorage } from "../configuration/old/i.system.system.storage";

import { coreConstantsStorageCookies } from "./core.constants.storage.coookies";
import { coreConstantsDefaultDbColumnNames } from "./core.constants.storage.db.column.names";

/**
 * Constants related to storage
 * (db, sessionStorage, systemStorage, cookies, etc.))
 */
export const coreConstantsStorage = {
  /**
   * Constants related to storing
   * data in databases.
   */
  db: {
    /**
     * Constants used to refer consistently to column names
     *  
     */
    columnNames: {
      defaults: coreConstantsDefaultDbColumnNames
      
    }
  },
  /**
   * Constants related to storing information
   * in sessionStorage
   */
  session: {
    token: 'token',
    /**
     * key for storing the current user
     * See: tokenStorageService.
     * */
    currentUser: 'currentUser',
    /**
     * key for storing the auth token
     * See: tokenStorageService.
     * */
    authToken: 'auth-token',
    /**
     * see LoginComponent.
     * TODO: improve this description.
     */
    toast: 'toast',

    users: 'users',

    /** TODO: There's duplication that needs rationalisation and consolidation! */
    /** used for bearer token */
    authUser: 'authUser'
  },
  /**
   * Constants related to storing information
   * in systemStorage, beyond a single session
   */
  system: {},
  /**
   * Misc constants related to storage.
   */
  shared: {
  },
  cookies: coreConstantsStorageCookies
}



