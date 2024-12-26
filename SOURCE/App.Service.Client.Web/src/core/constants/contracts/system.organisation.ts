import { IHasTitleAndDescription } from "../../models/contracts/IHasTitleAndDescription";

export interface SystemOrganisation extends IHasTitleAndDescription {
  // Has Title, Description
  email?: string;
  tel?: string;
  channels?: {
    tel: string,
    email:string,
    postal: {
      street: string,
      city: string,
      region: string,
      code: string,
      country: string
    }
  }
}
