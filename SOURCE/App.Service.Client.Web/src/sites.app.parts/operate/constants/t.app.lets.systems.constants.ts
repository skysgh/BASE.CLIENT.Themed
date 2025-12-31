import { TBaseConstants } from "../../../core/base/constants/t.base.constants"
// Architecture is a domain applet in sites.app.lets
import { TAppletsArchitectureConstantsResources } from "../../../sites.app.lets/architecture/constants/t.app.lets.architecture.constants.resources"
import { TAppletsSystemsConstantsApis } from "./t.app.lets.systems.constants.apis"
import { TAppletsSystemsConstantsAssets } from "./t.app.lets.systems.constants.assets"

export type TAppletsSystemsConstants = TBaseConstants & {

  apis: TAppletsSystemsConstantsApis,
  assets: TAppletsSystemsConstantsAssets,
  resources: TAppletsArchitectureConstantsResources
}

