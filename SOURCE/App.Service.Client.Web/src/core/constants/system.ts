import { environment } from "../../environments/environment";
import { systemAssets } from "./system.assets";
import { systemConfiguration } from "./system.configuration";
//import { systemKeys } from "./system.keys";
import { systemIntegrations } from "./system.integration";
import { systemNavigation } from "./system.navigation";
import { systemCopyrights } from "./system.copyrights";
import { systemDistributor } from "./system.distributor";
import { systemSponsor } from "./system.sponsor";
import { systemDeveloper } from "./system.developer";
import { SystemDynamic } from "./contracts/system.dynamics";
import { systemQueryEndpoints } from "./system-query-endpoints";
import { systemStats } from "./system.stats";
import { SystemService } from "./system.service";
import { systemStorage } from "./system.storage";
/**
 * NOTE: note that type created is defined 'as const' on
 * tail of instance.
 * 
 */
export const system /*: System*/ = {

  title: "BASE",

  description: "Base API Support Environment",

  purpose: "Provide actionable oversight over large systems of organisations.",

  environment: environment,

  sources: systemAssets,

  navigation: systemNavigation,

  integration: systemIntegrations,

  apis: systemQueryEndpoints,

  stats: systemStats,

  storage: systemStorage,

  get dynamic(): SystemDynamic {
    var result: SystemDynamic = {
      distributor: systemDistributor,
      sponsor: systemSponsor,
      developer: systemDeveloper,
      copyrights: systemCopyrights,
      configuration: systemConfiguration,
      service: SystemService,

    };
    return result;
  }
} as const;

