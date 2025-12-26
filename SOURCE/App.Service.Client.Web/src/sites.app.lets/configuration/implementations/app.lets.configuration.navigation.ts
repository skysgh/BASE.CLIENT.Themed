import { appletsSystemsConfiguration } from "../../system/configuration/implementations/app.lets.systems.configuration";
import { StringService } from "../../../core/services/string.service";
import { environment } from "../../../environments/environment";
import { TAppletsConfigurationNavigation } from "../t.app.lets.configuration.navigation";
import { appletsEducationConfiguration } from "../../education/configuration/implementations/app.lets.education.configuration";
import { appletsSpikesConfiguration } from "../../spike/configuration/implementations/app.lets.spikes.configuration";
import { appletsDemosConfiguration } from "../../demos/configuration/implementations/app.lets.demos.configuration";
import { appletsArchitectureConfiguration } from "../../architecture/configuration/implementations/app.lets.architecture.configuration";

const NAME = 'Applets';
const NAV_ROOT = StringService.replaceTemplate(environment.custom.urls.navigation.root, '');


export const appletsConfigurationNavigation : TAppletsConfigurationNavigation = {

  // IMPORTANT:
  // You have to point at the cnofig object rather than the navigation object
  // or else you'll be generating a new copy of navigation that won't be overrideen
  // with any override values that were set at startup.


    root: `${NAV_ROOT}`, /*${subDirs}*/
  

    architecture: appletsArchitectureConfiguration.navigation,

    // Still a mess:
    //todo: appletsConfiguration.navigationTodo,

    /**
     * Logs, Errors, Sessions, Operations, Roles, Permissions, Users. 
     */
    systems: appletsSystemsConfiguration.navigation,

    demos: appletsDemosConfiguration.navigation,

    /** For development purposes only */
    spikes: appletsSpikesConfiguration.navigation,

    /**
     * 
     */
    education: appletsEducationConfiguration.navigation,


};


