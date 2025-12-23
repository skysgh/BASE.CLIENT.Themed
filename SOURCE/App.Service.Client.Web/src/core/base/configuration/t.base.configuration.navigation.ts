import { TAppletsEducationConfigurationNavigation } from "../../../app.lets/education/configuration/t.app.lets.education.configuration.navigation";
import { TBaseConfigurationObject } from "../t.base.configuration.object";

/**
 * Base Type for Navigation Configuration objects.
 * 
 * Note:
 * Don't expect there to be a need for urls that
 * are specific to CoreAg.
 *
 * Note also that the difference between
 * Interfaces and Types is that while both complain
 * if properties are not initiated, Types permit adding
 * more variables, whereas Interfaces do.
 */
export type TBaseConfigurationNavigationRoutes = TBaseConfigurationObject &  {
  /** Root of Navigation*/
  root: string,


}
