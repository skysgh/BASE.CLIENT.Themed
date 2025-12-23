import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TAppletsTransactionsConfigurationNavigation } from "../t.app.lets.transactions.configuration.navigation";

const NAME = 'Transactions';
const NAV_ROOT = StringService.replaceTemplate(environment.custom.urls.navigation.appletSectionApplets, '');

export const appletsTransactionsConfigurationNavigation: TAppletsTransactionsConfigurationNavigation = {
  root: `${NAV_ROOT}`
};

