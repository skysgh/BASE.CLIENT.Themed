import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TAppletsArchitectureConstantsResources } from "../t.app.lets.architecture.constants.resources";

const NAME = 'Architecture';
const PREFIX = '/Applets/' + NAME;
export const RESOURCES_OPEN = StringService.replaceTemplate(environment.custom.urls.media.open, PREFIX);
export const RESOURCES_SENSITIVE = StringService.replaceTemplate(environment.custom.urls.media.sensitive, PREFIX);


export const appletsArchitectureConstantsResources: TAppletsArchitectureConstantsResources = {
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
};
