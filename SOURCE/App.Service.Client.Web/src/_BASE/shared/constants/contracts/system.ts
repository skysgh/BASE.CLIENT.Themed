import { HasTitleAndDescriptionBase } from "../../models/base/HasTitleAndDescriptionBase";
import { IHasTitleAndDescription } from "../../models/contracts/IHasTitleAndDescription";
import { SystemSources} from "./SystemSources";
import { SystemNavigation } from "./systemNavigation";
import { SystemOrganisation } from "./systemOrganisation";


export interface System extends IHasTitleAndDescription {
  // Has title, description
  purpose: string;

  distributor: SystemOrganisation; 
  sponsor: SystemOrganisation; 
  developer: SystemOrganisation;

  environment: any;
  // 
  sources: SystemSources;
  // Navigation
  navigation: SystemNavigation /*SystemUrls*/;
}
