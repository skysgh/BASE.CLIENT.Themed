import { TBaseConfiguration } from "../../../core/base/configuration/t.base.configuration";
import { TAppletsTransactionsConstants } from "../constants/t.app.lets.transactions.constants";
import { TAppletsTransactionsConfigurationNavigation } from "./t.app.lets.transactions.configuration.navigation";
import { TAppletsTransactionsConfigurationOthers } from "./t.app.lets.transactions.configuration.others";

export type TAppletsTransactionsConfiguration = TBaseConfiguration & {

  navigation: TAppletsTransactionsConfigurationNavigation,
  others: TAppletsTransactionsConfigurationOthers,
  constants: TAppletsTransactionsConstants,
}
