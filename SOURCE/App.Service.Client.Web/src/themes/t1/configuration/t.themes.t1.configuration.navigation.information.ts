import { TBaseConfigurationNavigationRoutes } from "../../../core/base/configuration/t.base.configuration.navigation";
import { TThemesT1ConfigurationNavigationInformationOrganisation } from "./t.themes.t1.configuration.navigation.information.organisation";
import { TThemesT1ConfigurationNavigationInformationService } from "./t.themes.t1.configuration.navigation.information.service";


export type TThemesT1ConfigurationNavigationInformation = TBaseConfigurationNavigationRoutes & {

  organisation: TThemesT1ConfigurationNavigationInformationOrganisation

  service: TThemesT1ConfigurationNavigationInformationService
};

