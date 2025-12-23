import { TBaseConfigurationObject } from "../t.base.configuration.object";

/**
 * Base Type for Constant url to APIs endpoints.
 * 
 * Note that the difference between
 * Interfaces and Types is that while both complain
 * if properties are not initiated, Types permit adding
 * more variables, whereas Interfaces do.
 */
export type TBaseConstantsApis = TBaseConfigurationObject & {
  // NO ROOT IN APIS.
}
