import { TBaseConstants } from "../../../core/base/constants/t.base.constants"
import { TAppletsArchitectureConstantsApis } from "./t.app.lets.architecture.constants.apis"
import { TAppletsArchitectureConstantsAssets } from "./t.app.lets.architecture.constants.assets"
import { TAppletsArchitectureConstantsResources } from "./t.app.lets.architecture.constants.resources"

export type TAppletsArchitectureConstants = TBaseConstants & {

  apis: TAppletsArchitectureConstantsApis,

  assets: TAppletsArchitectureConstantsAssets

  resources: TAppletsArchitectureConstantsResources

}
