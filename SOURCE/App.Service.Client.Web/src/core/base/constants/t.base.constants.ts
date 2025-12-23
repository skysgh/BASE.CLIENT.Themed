import { environment } from "../../../environments/environment";

import { TBaseConstantsApis } from "./t.base.constants.apis";
import { TBaseConstantsAssets } from "./t.base.constants.assets";
import { TBaseConfigurationObject } from "../t.base.configuration.object";
import { TBaseConstantsResources } from "./t.base.constants.resources";

/**
 * Base Type of for Constants.
 * 
 * Note that the difference between
 * Interfaces and Types is that while both complain
 * if properties are not initiated, Types permit adding
 * more variables, whereas Interfaces do.
 */
export type TBaseConstants = TBaseConfigurationObject & {

  /**
   * The unique identifier for this group of constants.
   */
  id: string,

  /**
   * URLs to service endpoints
   */
  apis: TBaseConstantsApis,

  /**
   * Urls to static assets
   * that are always open.
   */
  assets: TBaseConstantsAssets,

  /**
   * Urls to *dynamic* resources
   * that may be either
   * open to all
   * or sensitive
   * */
  resources: TBaseConstantsResources, 


  /**
   * The environment's deployed constants.
   */
  environment: typeof environment,
}
