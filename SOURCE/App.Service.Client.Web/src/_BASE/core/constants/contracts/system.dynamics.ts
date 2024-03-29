import { SystemOrganisation } from "./system.organisation";
import { SystemCopyrights } from "./system.copyrights";
import { SystemConfiguration } from "./system.configuration";

export interface SystemDynamic {
  distributor: SystemOrganisation;
  sponsor: SystemOrganisation;
  developer: SystemOrganisation;
  copyrights: SystemCopyrights;
  configuration: SystemConfiguration;

}
