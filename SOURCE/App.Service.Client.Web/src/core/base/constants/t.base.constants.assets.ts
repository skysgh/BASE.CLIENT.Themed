import { TBaseConfigurationObject } from "../t.base.configuration.object";

/**
 * 
 * Note that the difference between
 * Interfaces and Types is that while both complain
 * if properties are not initiated, Types permit adding
 * more variables, whereas Interfaces do.
*/
export type TBaseConstantsAssets = TBaseConfigurationObject & {
  root: string,
  i18n?: string,
  images: {
    root: string,
    recordTypes?: string,
    [key: string]: any; // Allow extensibility
    //flags: string
  }
  [key: string]: any; // Allow extensibility
}
