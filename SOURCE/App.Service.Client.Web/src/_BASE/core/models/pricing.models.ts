import { IHasPlanDetails } from "./contracts/IHasPlanDetails";
import { IHasMonthlyRate } from "./contracts/IHasMonthlyRate";
import { IHasRate } from "./contracts/IHasRate";
import { IHasTitleAndDescription } from "./contracts/IHasTitleAndDescription";
import { IHasUUID } from "./contracts/IHasUUID";
import { IHasYearlyPrice } from "./contracts/IHasYearlyPrice";
import { IHasImageId } from "./contracts/IHasImageId";


/**
 * Yearly Plan
 */
export interface YearlyPlanModel
  extends IHasUUID,
  IHasTitleAndDescription,
  IHasImageId,
  IHasMonthlyRate,
  IHasYearlyPrice,
  IHasPlanDetails {

  ribbon?: any;

  supportClass?: any;
  supportClassSymbol?: any;
  storageClass?: any;
  storageClassSymbol?: any;
  domainClass?: any;
  domainClassSymbol?: any;
  planButtonClassname?: any;
  plan?: any
}

/**
 * Choose Plan
 */
export interface PricingModel extends IHasUUID, IHasTitleAndDescription, IHasImageId,IHasRate {
  ribbon: any,



  supportClass: any,
  supportClassSymbol: any,
  storageClass: any,
  storageClassSymbol: any,
  domainClass: any,
  domainClassSymbol: any,
  planButtonClassname: any;
  plan?: any
}

/**
 * Simple Plan
 */
export interface SimpleModel extends IHasUUID, IHasTitleAndDescription, IHasRate {
  users: number,
  storage: String,
  domain: string,
  support: string,
  ribbon: any
}
