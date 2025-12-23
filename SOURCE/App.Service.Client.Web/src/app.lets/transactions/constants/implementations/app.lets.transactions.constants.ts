import { environment } from "../../../../environments/environment";
import { TAppletsTransactionsConstants } from "../t.app.lets.transactions.constants";

import { appletsTransactionsConstantsApis } from "./app.lets.transactions.constants.apis";
import { appletsTransactionsConstantsAssets } from "./app.lets.transactions.constants.assets";
import { appletsTransactionsConstantsResources } from "./app.lets.transactions.constants.resources";

export const NAME = 'Transactions';

export const appletsTransactionsConstants : TAppletsTransactionsConstants = {

  id: NAME,

  apis: appletsTransactionsConstantsApis,

  assets: appletsTransactionsConstantsAssets,

  environment: environment,

  resources: appletsTransactionsConstantsResources

};

