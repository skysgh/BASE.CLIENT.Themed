import { IHasPlanDetails } from "./contracts/IHasPlanDetails";
import { IHasImageId } from "./contracts/IHasImageId";
import { IHasMonthlyRate } from "./contracts/IHasMonthlyRate";
import { IHasTitleAndDescription } from "./contracts/IHasTitleAndDescription";
import { IHasUUID } from "./contracts/IHasUUID";

/**
 * Monthly Plan
 */


export interface MonthlyPlanModel
    extends
  IHasUUID,
  IHasTitleAndDescription,
  IHasImageId,
  IHasMonthlyRate,

  IHasPlanDetails {
    ribbon?: any;
    plan?: any;
    supportClass?: any;
    supportClassSymbol?: any;
    storageClass?: any;
    storageClassSymbol?: any;
    domainClass?: any;
    domainClassSymbol?: any;
    planButtonClassname?: any;
}
