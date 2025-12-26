import { TBaseConstants } from "../../../core/base/constants/t.base.constants"
import { TAppletsTemplateConstantsApis } from "./t.app.lets.template.constants.apis"
import { TAppletsTemplateConstantsAssets } from "./t.app.lets.template.constants.assets"
import { TAppletsTemplateConstantsResources } from "./t.app.lets.template.constants.resources"

export type TAppletsTemplateConstants = TBaseConstants & {

  apis: TAppletsTemplateConstantsApis,
  assets: TAppletsTemplateConstantsAssets,
  resources: TAppletsTemplateConstantsResources
}

