import { TBaseConfigurationNavigationRoutes } from "../base/configuration/t.base.configuration.navigation";


/**
 * Contract for Navigation Routes specific to Core.
 *  
 * Note that the difference between
 * Interfaces and Types is that while both complain
 * if properties are not initiated, Types permit adding
 * more variables, whereas Interfaces do.
 */
export type TCoreConfigurationNavigation = TBaseConfigurationNavigationRoutes & {};
