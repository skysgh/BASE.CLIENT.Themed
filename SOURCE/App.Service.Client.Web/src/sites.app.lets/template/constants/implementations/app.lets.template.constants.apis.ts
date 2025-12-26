import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TAppletsTemplateConstantsApis } from "../t.app.lets.template.constants.apis";

const NAME = 'Template'
const API_ROOT = StringService.replaceTemplate(environment.custom.urls.apis.section, NAME);

export const appletsTemplateConstantsApis : TAppletsTemplateConstantsApis = {
    root: `${API_ROOT}`
}
