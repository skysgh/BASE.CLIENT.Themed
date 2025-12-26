import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TAppletsDemosConstantsApis } from "../t.app.lets.demos.constants.apis";

const NAME = 'Demos'
const API_ROOT = StringService.replaceTemplate(environment.custom.urls.apis.section, NAME);

export const appletsDemosConstantsApis : TAppletsDemosConstantsApis = {
  root: `${API_ROOT}`
}
