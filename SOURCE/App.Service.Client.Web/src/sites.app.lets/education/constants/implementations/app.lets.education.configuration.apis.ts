import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TAppletsEducationConstantsApis } from "../t.app.lets.education.constants.apis";
import { PATHFRAGMENT } from "../app.lets.education.constants.name";

// Convert path fragment to API-safe format (replace slashes with dots)
const API_SEGMENT = PATHFRAGMENT.replace(/\//g, '.');  // 'app.lets/education' → 'app.lets.education'
const API_ROOT = StringService.replaceTemplate(environment.custom.urls.apis.section, API_SEGMENT);

export const appletsEducationConstantsApis: TAppletsEducationConstantsApis =  {
  root: `${API_ROOT}`,
}
