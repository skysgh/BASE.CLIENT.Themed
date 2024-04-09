import { IHasRate } from "./contracts/IHasRate";
import { IHasTitleAndDescription } from "./contracts/IHasTitleAndDescription";
import { IHasUUID } from "./contracts/IHasUUID";


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
