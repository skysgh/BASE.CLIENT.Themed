import { SystemOrganisation } from "./system.organisation";
import { SystemCopyrights } from "./system.copyrights";
import { SystemConfiguration } from "./system.configuration";
import { SystemService } from "./system.service";

export interface SystemDynamic {
  distributor: SystemOrganisation;
  sponsor: SystemOrganisation;
  developer: SystemOrganisation;
  copyrights: SystemCopyrights;
  configuration: SystemConfiguration;
  service: SystemService;
}
