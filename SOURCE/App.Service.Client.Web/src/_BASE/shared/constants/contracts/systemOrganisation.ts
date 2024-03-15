import { HasTitleAndDescriptionBase } from "../../models/base/HasTitleAndDescriptionBase";
import { IHasTitleAndDescription } from "../../models/contracts/IHasTitleAndDescription";

export interface SystemOrganisation extends IHasTitleAndDescription {
  // Has Title, Description
  email?: string;
  tel?: string;
}
