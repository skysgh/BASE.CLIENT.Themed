import { TBaseConstants } from "../../core/base/constants/t.base.constants";
import { TSitesConstantsApis } from "./t.sites.constants.apis";
import { TSitesConstantsAssets } from "./t.sites.constants.assets";
import { TSitesConstantsResources } from "./t.sites.constants.resources";

/**
 * ✅ UPDATED after tier restructuring:
 * Changed from 'Sites' to 'Sites.Anon' to match new tier structure
 */
export const NAME = 'Sites.Anon';

export type TSitesConstants = TBaseConstants & {
  apis: TSitesConstantsApis;

  assets: TSitesConstantsAssets;

  resources: TSitesConstantsResources;
};
