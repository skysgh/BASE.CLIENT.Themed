import { appletsConstantsAssets } from "./app.lets.constants.assets";
import { appletsConstantsApis } from "./app.lets.configuration.apis";
import { environment } from "../../../environments/environment";
import { TAppletsConstants } from "../t.app.lets.constants";
import { appletsConstantsResources } from "./app.lets.constants.resources";

/**
 * Display name (human-readable)
 */
const NAME = 'Applets';

/**
 * Machine file path (with trailing slash for safe concatenation)
 * ✅ Example: `${ROOT_RELATIVE_PATH}education` → "app.lets/education"
 */
export const ROOT_RELATIVE_PATH = 'app.lets/';  // ✅ Trailing slash!

export const appletsConstants : TAppletsConstants = {
  id: NAME,

    // Note that it doesn't insert the id (only individual applets do):
  apis: appletsConstantsApis,

  // Note that it doesn't insert the id (only individual applets do):
  assets: appletsConstantsAssets,

  /** Direct access to Applets immutable environment configuration */
  environment: environment,

  resources: appletsConstantsResources
};

