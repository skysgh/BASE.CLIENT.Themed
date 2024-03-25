import { IHasPlanDetails } from "./contracts/IHasPlanDetails";
import { IHasIconId } from "./contracts/IHasIconId";
import { IHasIconIdentifier } from "./contracts/IHasIconIdentifier";
import { IHasMonthlyRate } from "./contracts/IHasMonthlyRate";
import { IHasRate } from "./contracts/IHasRate";
import { IHasTitleAndDescription } from "./contracts/IHasTitleAndDescription";
import { IHasUUID } from "./contracts/IHasUUID";
import { IHasYearlyPrice } from "./contracts/IHasYearlyPrice";


/**
 * Monthly Plan
 */
export interface MonthlyPlanModel
  extends
  IHasUUID,
  IHasTitleAndDescription,
  IHasIconIdentifier,
  IHasMonthlyRate,
  IHasPlanDetails {

  ribbon?: any;
  plan?: any

  supportClass?: any;
  supportClassSymbol?: any;
  storageClass?: any;
  storageClassSymbol?: any;
  domainClass?: any;
  domainClassSymbol?: any;
  planButtonClassname?: any;
}

/**
 * Yearly Plan
 */
export interface YearlyPlanModel
  extends IHasUUID,
  IHasTitleAndDescription,
  IHasIconIdentifier,
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
export interface PricingModel extends IHasUUID, IHasTitleAndDescription, IHasIconId,IHasRate {
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
