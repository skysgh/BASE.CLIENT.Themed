import { TBaseConstants } from "../../core/base/constants/t.base.constants";
import { TSitesConstantsApis } from "./t.sites.constants.apis";
import { TSitesConstantsAssets } from "./t.sites.constants.assets";
import { TSitesConstantsResources } from "./t.sites.constants.resources";

export const NAME = 'Sites';

export type TSitesConstants = TBaseConstants & {

  apis: TSitesConstantsApis,

  assets: TSitesConstantsAssets,

  resources: TSitesConstantsResources,
}
