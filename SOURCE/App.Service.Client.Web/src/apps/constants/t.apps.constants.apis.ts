import { TBaseConstantsApis } from "../../core/base/constants/t.base.constants.apis";

/**
 * Contract Type for
 * Apis specific to the
 * Apps section.
 */
export type TAppsConstantsApis = TBaseConstantsApis & {
  /** Root url */
  root: string;

  transactions: string;

  [key: string]: any; // Allow extensibility
}
