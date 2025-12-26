import { NAME } from "../t.sites.constants";

import { TBaseConstantsApis } from "../../../core/base/constants/t.base.constants.apis";
import { StringService } from "../../../core/services/string.service";
import { environment } from "../../../environments/environment";
import { TSitesConstantsApisTodo } from "../t.sites.constants.apis.todo";


const API_ROOT =
  StringService.replaceTemplate(
    environment.custom.urls.apis.section,
    NAME).toLowerCase();

export const sitesConstantsApisTodo: TSitesConstantsApisTodo = {
  statements: `${API_ROOT}base_service_Statements`,
  agreements: `${API_ROOT}base_service_Agreements`,
  templateItems: `${API_ROOT}templateItems`,
  templateSubItems: `${API_ROOT}templateSubItems`,
  licenses: `${API_ROOT}licenses`,
  subscriptions: `${API_ROOT}subscriptions`,
  notificationDisplayItem: `${API_ROOT}todo_notificationDisplayItem`,
  todo_tasks: `${API_ROOT}todo_tasks`,

}

