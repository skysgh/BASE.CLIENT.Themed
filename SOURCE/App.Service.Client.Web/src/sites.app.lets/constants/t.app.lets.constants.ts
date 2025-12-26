import { TBaseConstants } from "../../core/base/constants/t.base.constants"
import { TBaseConstantsApis } from "../../core/base/constants/t.base.constants.apis"
import { TBaseConstantsAssets } from "../../core/base/constants/t.base.constants.assets"
import { TBaseConstantsResources } from "../../core/base/constants/t.base.constants.resources"


export type TAppletsConstants = TBaseConstants & {

  apis: TBaseConstantsApis,

  assets: TBaseConstantsAssets,

  resources: TBaseConstantsResources, 
}


