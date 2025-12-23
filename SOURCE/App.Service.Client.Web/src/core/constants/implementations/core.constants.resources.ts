import { NAME } from "../t.core.constants";
import { environment } from "../../../environments/environment";
import { StringService } from "../../services/string.service";
import { TCoreConstantsResources } from "../t.core.constants.resources";

export const RESOURCES_OPEN = StringService.replaceTemplate(environment.custom.urls.media.open, NAME).toLowerCase();
export const RESOURCES_SENSITIVE = StringService.replaceTemplate(environment.custom.urls.media.sensitive, NAME).toLowerCase();

export const coreConstantsResources: TCoreConstantsResources = {
  open: {
    root: `${RESOURCES_OPEN}`,
    images: {
      root: `${RESOURCES_OPEN}images/`,
    }
  },
  sensitive: {
    root: `${RESOURCES_SENSITIVE}`,
    images: {
      root: `${RESOURCES_SENSITIVE}images/`,
    }
  }
}
