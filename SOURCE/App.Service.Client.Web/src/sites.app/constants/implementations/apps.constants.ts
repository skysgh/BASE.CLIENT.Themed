import { NAME } from "../apps.constants.name";

import { TAppsConstants } from "../t.apps.constants";
import { environment } from "../../../environments/environment";
import { appsConstantsApis } from "./apps.constants.apis";
import { appsConstantsAssets } from "./apps.constants.assets";
import { appsConstantsResources } from "./apps.constants.resources";

/** Constants specific to the app.
 *
 * Provide easy access to the core, coreAg, themes, sites, and applet
 * constants.
 */

export { NAME };

export const appsConstants: TAppsConstants = {
  /** Identifier (not the same as description/title)  */
  id: NAME,

  /** Apps API routes*/
  apis: appsConstantsApis,

  /** Apps Asset routes */
  assets: appsConstantsAssets,

  resources: appsConstantsResources,

  /** System Environment */
  environment: environment

};

