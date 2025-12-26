import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TAppletsArchitectureConstantsResources } from "../../../architecture/constants/t.app.lets.architecture.constants.resources";

const NAME = 'Demos';
const RESOURCES_OPEN = StringService.replaceTemplate(environment.custom.urls.media.open, NAME);
const RESOURCES_SENSITIVE = StringService.replaceTemplate(environment.custom.urls.media.sensitive, NAME);


export const appletsDemosConstantsResources: TAppletsArchitectureConstantsResources = {
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
