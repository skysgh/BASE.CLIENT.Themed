import { TBaseConfigurationObject } from "../t.base.configuration.object";

/** Base Type for *dynamic* assets
 * uploaded by end user of some type.
 */
export type TBaseConstantsResources = TBaseConfigurationObject & {
  open: {
    root: string;
    images: {
      root: string;
      [key: string]: any; // Allow extensibility
    }
    [key: string]: any; // Allow extensibility
  }
  sensitive: {
    root: string;
    images: {
      root: string;
      [key: string]: any; // Allow extensibility
    }
    [key: string]: any; // Allow extensibility
  }
}
