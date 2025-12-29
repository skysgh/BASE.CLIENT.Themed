import { TBaseConfigurationNavigationRoutes } from "../../core/base/configuration/t.base.configuration.navigation";
import { TAppletsArchitectureConfigurationNavigation } from "../architecture/configuration/t.app.lets.architecture.configuration.navigation";
import { TAppletsDemosConfigurationNavigation } from "../demos/configuration/t.app.lets.demos.configuration.navigation";
import { appletsEducationConfiguration } from "../education/configuration/implementations/app.lets.education.configuration";
import { TAppletsEducationConfigurationNavigation } from "../education/configuration/t.app.lets.education.configuration.navigation";
import { appletsEducationConstants } from "../education/constants/implementations/app.lets.education.constants";
import { TAppletsSpikesConfigurationNavigation } from "../spike/configuration/t.app.lets.spikes.configuration.navigation";
import { TAppletsSystemsConfigurationNavigation } from "../service.operate/configuration/t.app.lets.systems.configuration.navigation";


export type TAppletsConfigurationNavigation = TBaseConfigurationNavigationRoutes & {


    architecture: TAppletsArchitectureConfigurationNavigation,

    education: TAppletsEducationConfigurationNavigation

    systems: TAppletsSystemsConfigurationNavigation,

    demos: TAppletsDemosConfigurationNavigation,

    /** For development purposes only */
    spikes: TAppletsSpikesConfigurationNavigation,



};
