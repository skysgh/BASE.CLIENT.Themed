import { NAME, PATHFRAGMENT } from "../apps.constants.name";
import { StringService } from "../../../core/services/string.service";
import { environment } from "../../../environments/environment";
import { TAppsConstantsResources } from "../t.apps.constants.resources";

// Use PATHFRAGMENT for asset paths
const OPEN_DYNAMIC = StringService.replaceTemplate(environment.custom.urls.media.open, PATHFRAGMENT);
const SENSITIVE_DYNAMIC = StringService.replaceTemplate(environment.custom.urls.media.sensitive, PATHFRAGMENT);

/**
 * Apps Constants Resources
 * 
 * ✅ FIXED: No longer imports sitesConfiguration (circular dependency removed)
 * 
 * Why the fix:
 * - Apps importing Sites = circular dependency (Apps → Sites → Apps)
 * - Hardcode path like apps.main does
 * - Breaks circular dependency chain
 * 
 * Note:
 * - apps.main uses: /media/apps.main/
 * - apps uses: /media/apps/
 * - Both serve different purposes!
 */
export const appsConstantsResources: TAppsConstantsResources = {
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
            // Note this is just to directory
            // after that, 
            markdownDir: `${OPEN_DYNAMIC}files/markdown/`,
            pdfDir: `${OPEN_DYNAMIC}files/pdf/`
        }
    },
    sensitive: {
        root: `${SENSITIVE_DYNAMIC}`,
        images: {
            root: `${SENSITIVE_DYNAMIC}images/`,
            // ✅ FIXED: Hardcode instead of referencing sitesConfiguration
            // Was: sitesConfiguration.constants.resources.sensitive.images.users
            users: `${SENSITIVE_DYNAMIC}images/users/`,  // Same path, no circular dependency!
        }
    }
};
