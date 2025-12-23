import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TThemesT1ConstantsApis } from "../t.themes.t1.constants.apis";

const NAME = 'Themes/T1'
const API_ROOT = StringService.replaceTemplate(environment.custom.urls.apis.section, NAME);

export const themesT1ConstantsApis: TThemesT1ConstantsApis = {
  /**
   * Url Root
   */
  root: `${API_ROOT}`,

    // Api Calling
  themesbrand: {
    API_URL: 'https://api-node.themesbrand.website/',

    // Auth Api
    AUTH_API: "https://api-node.themesbrand.website/auth/"
  }

};
