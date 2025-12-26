import { StringService } from "../../../core/services/string.service";
import { environment } from "../../../environments/environment";
import { TAppletsConstantsResources } from "../t.app.lets.constants.resources";

const NAME = 'Applets';
const ASSETS_OPEN = StringService.replaceTemplate(environment.custom.urls.assets.deployed, NAME);
const RESOURCES_OPEN = StringService.replaceTemplate(environment.custom.urls.media.open, NAME);
const RESOURCES_SENSITIVE = StringService.replaceTemplate(environment.custom.urls.media.sensitive, NAME);


export const appletsConstantsResources: TAppletsConstantsResources = {
    open: {
        root: `${RESOURCES_OPEN}`,
        images: {
            root: `${RESOURCES_OPEN}images/`,
            //recordTypes: `${ASSETS_OPEN}images/recordTypes/`,
        }
    },
    sensitive: {
        root: `${RESOURCES_SENSITIVE}`,
        images: {
            root: `${RESOURCES_SENSITIVE}images/`,
        }
    }
};
