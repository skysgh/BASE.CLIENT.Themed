import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TAppletsSystemsConstantsApis } from "../t.app.lets.systems.constants.apis";

const NAME = 'System'
const API_ROOT = StringService.replaceTemplate(environment.custom.urls.apis.section, NAME);

export const appletsSystemsConstantsApis : TAppletsSystemsConstantsApis = {
    root: `${API_ROOT}`,
}
