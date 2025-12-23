import { TBaseConstants } from "../../../core/base/constants/t.base.constants"
import { TAppletsDemosConstantsApis } from "./t.app.lets.demos.constants.apis"
import { TAppletsDemosConstantsAssets } from "./t.app.lets.demos.constants.assets"
import { TAppletsDemosConstantsResources } from "./t.app.lets.demos.constants.resources"

export type TAppletsDemosConstants = TBaseConstants & {

  apis: TAppletsDemosConstantsApis,
  assets: TAppletsDemosConstantsAssets,
  resources: TAppletsDemosConstantsResources
}

