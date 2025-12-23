import { NAME, PATHFRAGMENT } from "../apps.main.constants.name";
import { StringService } from "../../../core/services/string.service";
import { environment } from "../../../environments/environment";
import { TAppsMainConstantsResources } from "../t.apps.main.constants.resources";

// Use PATHFRAGMENT for asset paths
const OPEN_DYNAMIC = StringService.replaceTemplate(environment.custom.urls.media.open, PATHFRAGMENT);
const SENSITIVE_DYNAMIC = StringService.replaceTemplate(environment.custom.urls.media.sensitive, PATHFRAGMENT);

export const appsMainConstantsResources: TAppsMainConstantsResources = {
    open: {
        root: `${OPEN_DYNAMIC}`,
        images: {
            root: `${OPEN_DYNAMIC}images/`,
            logos: `${OPEN_DYNAMIC}images/logos/`,
            trustedBy: `${SENSITIVE_DYNAMIC}images/trustedBy/`,
            flags: `${SENSITIVE_DYNAMIC}images/flags/`,
            backgrounds: `${SENSITIVE_DYNAMIC}images/logos/backgrounds/`
        },
        files: {
            root: `${OPEN_DYNAMIC}files/`,
            markdownDir: `${OPEN_DYNAMIC}files/markdown/`,
            pdfDir: `${OPEN_DYNAMIC}files/pdf/`
        }
    },
    sensitive: {
        root: `${SENSITIVE_DYNAMIC}`,
        images: {
            root: `${SENSITIVE_DYNAMIC}images/`,
            users: `${SENSITIVE_DYNAMIC}images/users/`
        }
    }
};
