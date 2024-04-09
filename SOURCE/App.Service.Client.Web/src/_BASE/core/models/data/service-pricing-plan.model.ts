import { IHasPlanDetails } from "../contracts/IHasPlanDetails";
import { IHasImageId } from "../contracts/IHasImageId";
import { IHasMonthlyRate } from "../contracts/IHasMonthlyRate";
import { IHasTitleAndDescription } from "../contracts/IHasTitleAndDescription";
import { IHasUUID } from "../contracts/IHasUUID";
import { IHasYearlyRate } from "../contracts/IHasYearlyPrice";
import { IHasNaturalOrder } from "../contracts/IHasNaturalOrder";

/**
 * The trouble with a ServicePricingPlan
 * is the details that have to be associated
 * to the plan. At least when trying to
 * start development with a crappy standin
 * of a backend server, like json-server or
 * soul, which just don't have the depth
 * of a proper ODATA or similar API where
 * one can easily extend the response with
 * child elements.
 * Because it really would be best if we were
 * doing a 3 way join, with
 * Plan + Features + Features Allocated.
 * WHich I don't think is possible with
 * the above 2 servers.
 */
export interface ServicePricingPlan
  extends
  IHasUUID,
  // The order in which to organise responses.
  IHasNaturalOrder,
  IHasTitleAndDescription,
  IHasImageId,
  IHasMonthlyRate,
  IHasYearlyRate,
  IHasPlanDetails /* defines members,groups, projects, projects*/
{
  /** Whether to display "preferred" on the offering */
  ribbon?: any;
  /** */
}
