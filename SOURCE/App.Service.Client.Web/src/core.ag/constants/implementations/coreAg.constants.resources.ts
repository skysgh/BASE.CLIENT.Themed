import { NAME } from '../t.coreAg.constants'
import { StringService } from "../../../core/services/string.service";
import { environment } from "../../../environments/environment";

import { TCoreAgConstantsResources } from "../t.coreAg.constants.resources";


export const RESOURCES_OPEN =
  StringService.replaceTemplate(
    environment.custom.urls.media.open,
    NAME).toLowerCase();

export const RESOURCES_SENSITIVE =
  StringService.replaceTemplate(
    environment.custom.urls.media.sensitive,
    NAME).toLowerCase();

export const coreAgConstantsResources: TCoreAgConstantsResources = {
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
    },
};
