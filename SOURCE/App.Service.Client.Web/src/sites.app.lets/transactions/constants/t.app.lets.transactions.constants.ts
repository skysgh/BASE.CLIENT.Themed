import { TBaseConstants } from "../../../core/base/constants/t.base.constants"
import { TAppletsTransactionsConstantsApis } from "./t.app.lets.transactions.constants.apis"
import { TAppletsTransactionsConstantsAssets } from "./t.app.lets.transactions.constants.assets"
import { TAppletsTransactionsConstantsResources } from "./t.app.lets.transactions.constants.resources"

export type TAppletsTransactionsConstants = TBaseConstants & {

  apis: TAppletsTransactionsConstantsApis,
  assets: TAppletsTransactionsConstantsAssets
  resources: TAppletsTransactionsConstantsResources
}

