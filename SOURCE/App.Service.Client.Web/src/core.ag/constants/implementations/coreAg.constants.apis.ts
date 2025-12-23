import { NAME } from '../t.coreAg.constants'

import { StringService } from "../../../core/services/string.service";
import { environment } from "../../../environments/environment";
import { TCoreAgConstantsApis } from "../t.coreAg.constants.apis";


const API_ROOT =
  StringService.replaceTemplate(
    environment.custom.urls.apis.section,
    NAME).toLowerCase();



export const coreAgConstantsApis : TCoreAgConstantsApis = {
  root: `${API_ROOT}`
};
