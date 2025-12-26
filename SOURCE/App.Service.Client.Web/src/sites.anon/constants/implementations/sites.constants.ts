import { NAME } from "../t.sites.constants";

import { environment } from "../../../environments/environment";

import { sitesConstantsAssets } from "./sites.constants.assets";

import { TSitesConstants } from "../t.sites.constants";
import { sitesConstantsApis } from "./sites.constants.apis";
import { sitesConstantsResources } from "./sites.constants.resources";

/**
 * Constants for this group of code.
 * The routes for Navigation list what is available,
 * and only a proposal as to the route to each.
 * The appsConfiguration can use them as is -- or
 * define their own overloads for anyone or all,
 * if they so wish.
 *
 * Within this section one can either import this constant
 * or import systemService and get the settings object
 * from its nested position within system constant.
 * */
export const sitesConstants : TSitesConstants = {
  id: NAME,
  apis:   sitesConstantsApis,
  assets: sitesConstantsAssets,
  environment: environment,
  resources: sitesConstantsResources,

};
