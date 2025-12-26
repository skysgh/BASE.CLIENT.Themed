import { TBaseConstants } from "../../../core/base/constants/t.base.constants"
import { TAppletsEducationConstantsApis } from "./t.app.lets.education.constants.apis"
import { TAppletsEducationConstantsAssets } from "./t.app.lets.education.constants.assets"
import { TAppletsEducationConstantsResources } from "./t.applets.education.constants.Resources"

export type TAppletsEducationConstants = TBaseConstants & {

  apis: TAppletsEducationConstantsApis,
  assets: TAppletsEducationConstantsAssets,
  resources: TAppletsEducationConstantsResources
}

