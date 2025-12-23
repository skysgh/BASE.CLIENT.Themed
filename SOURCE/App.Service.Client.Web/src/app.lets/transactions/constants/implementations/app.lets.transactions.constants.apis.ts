import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TAppletsTransactionsConstantsApis } from "../t.app.lets.transactions.constants.apis";

const NAME = 'Trnsactions'
const API_ROOT = StringService.replaceTemplate(environment.custom.urls.apis, '');

export const appletsTransactionsConstantsApis : TAppletsTransactionsConstantsApis = {
    root: `${API_ROOT}`
};
