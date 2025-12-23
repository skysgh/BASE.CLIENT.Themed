import { environment } from "../../../../environments/environment";
import { appletsTransactionsConstants } from "../../constants/implementations/app.lets.transactions.constants";

import { TAppletsTransactionsConfiguration } from "../t.app.lets.transactions.configuration";
import { appletsTransactionsConfigurationOthers } from "./app.let.transactions.configuration.others";
import { appletsTransactionsConfigurationNavigation } from "./app.lets.transactions.configuration.navigation";

export const appletsTransactionsConfiguration : TAppletsTransactionsConfiguration = {

  constants: appletsTransactionsConstants,

  navigation: appletsTransactionsConfigurationNavigation,

  others: appletsTransactionsConfigurationOthers,

  environment: environment,
}
