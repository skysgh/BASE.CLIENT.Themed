import { TBaseConfigurationNavigationRoutes } from "../../../core/base/configuration/t.base.configuration.navigation";

export type TAppletsSpikesConfigurationNavigation = TBaseConfigurationNavigationRoutes & {


  spike: {
    explore: string,
    create: string,
    root: string
  },

  subSpike: {
    explore: string,
    create: string,
    root: string
  }

}
