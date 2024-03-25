import { HasTitleAndDescriptionBase } from "../../models/base/HasTitleAndDescriptionBase";
import { IHasTitleAndDescription } from "../../models/contracts/IHasTitleAndDescription";
import { SystemConfiguration } from "./systemConfiguration";
import { SystemSources} from "./systemSources";
import { SystemNavigation } from "./systemNavigation";
import { SystemOrganisation } from "./systemOrganisation";
import { SystemKeys } from "./systemKeys";
import { SystemLocalisation } from "./SystemLocalisation";


/**
 * System Settings for the whole app.
 */
export interface System extends IHasTitleAndDescription {
  // Has title, description
  purpose: string;

  distributor: SystemOrganisation; 
  sponsor: SystemOrganisation; 
  developer: SystemOrganisation;

  environment: any;
  //

  configuration: SystemConfiguration;
  sources: SystemSources;
  // Navigation
  navigation: SystemNavigation /*SystemUrls*/;
  keys: SystemKeys;
  localisation: SystemLocalisation;
}
