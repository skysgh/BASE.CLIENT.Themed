import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TThemesT1ConstantsResources } from "../t.themes.t1.constants.resources";


const NAME = 'Themes/T1';
const RESOURCES_OPEN = StringService.replaceTemplate(environment.custom.urls.media.open, NAME);
export const RESOURCES_SENSITIVE = StringService.replaceTemplate(environment.custom.urls.media.sensitive, NAME);

export const themesT1ConstantsResources: TThemesT1ConstantsResources = {
  open: {
        root: `${RESOURCES_OPEN}`,
        images: {
          root: `${RESOURCES_OPEN}images/`
        }
  },
  sensitive: {
    root: `${RESOURCES_SENSITIVE}`,
    images: {
      root: `${RESOURCES_SENSITIVE}images/`,
    }
  }
}
