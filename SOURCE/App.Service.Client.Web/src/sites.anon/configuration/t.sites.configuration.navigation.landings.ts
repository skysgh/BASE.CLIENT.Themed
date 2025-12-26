import { TBaseConfigurationNavigationRoutes } from "../../core/base/configuration/t.base.configuration.navigation";
import { TBaseConfigurationObject } from "../../core/base/t.base.configuration.object";

export type TSitesConfigurationNavigationLandings = TBaseConfigurationNavigationRoutes &  {
    root: string;
    index: string;
    comingSoon: string;
    opportunities: string;
    pricing: string;
    maintenance: string;
    faqs: string;
};
