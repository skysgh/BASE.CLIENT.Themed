import { IHasEnabled } from "../contracts/IHasEnabled";
import { IHasIconIdentifier } from "../contracts/IHasIconIdentifier";
import { IHasMonthlyRate } from "../contracts/IHasMonthlyRate";
import { IHasPlanDetails } from "../contracts/IHasPlanDetails";
import { IHasTitleAndDescription } from "../contracts/IHasTitleAndDescription";
import { IHasUUID } from "../contracts/IHasUUID";

export interface MonthlyPlanModel
  extends
  IHasUUID, IHasEnabled, IHasTitleAndDescription, IHasIconIdentifier, IHasMonthlyRate, IHasPlanDetails {

  
  enabled: true,

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
