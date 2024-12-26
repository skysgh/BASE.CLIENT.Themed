import { IHasRate } from "./contracts/IHasRate";
import { IHasTitleAndDescription } from "./contracts/IHasTitleAndDescription";
import { IHasUUID } from "./contracts/IHasUUID";
import { IHasImageId } from "./contracts/IHasImageId";

/**
 * Choose Plan
 */

export interface PricingModel extends IHasUUID, IHasTitleAndDescription, IHasImageId, IHasRate {
    ribbon: any;



    supportClass: any;
    supportClassSymbol: any;
    storageClass: any;
    storageClassSymbol: any;
    domainClass: any;
    domainClassSymbol: any;
    planButtonClassname: any;
    plan?: any;
}
