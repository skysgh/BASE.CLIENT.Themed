import { NAME } from "../apps.constants.name";
import { TAppsConstantsApis } from "../t.apps.constants.apis";
import { StringService } from "../../../core/services/string.service";
import { environment } from "../../../environments/environment";


/**
 * @const
 * @type { string }
 */
const API_ROOT: string = StringService.replaceTemplate(environment.custom.urls.apis.section, NAME);

/**
 * @const
 * @implements { TAppsConstantsApis }
 */
export const appsConstantsApis: TAppsConstantsApis = {

  /**
   * @inheritdoc
   */
  root: `${API_ROOT}`,

  transactions: 'TODO'
};
