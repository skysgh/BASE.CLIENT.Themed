import { TAppsConfigurationCopyrights } from "../t.apps.configuration.copyrights";
import { appsConfigurationDeveloperSystemOrganisation } from "./apps.configuration.system.developer";
import { appsConfigurationDistributorSystemOrganisation } from "./apps.configuration.system.distributor";
import { appsConfigurationSponsorSystemOrganisation } from "./apps.configuration.system.sponsor";

import { SystemDatetimeService } from "../../../core/services/system.datetime.service";


/**
 * Develop this app's copyright information.
 *
 * Use the default or create your own based on the `ISystemCopyrights` contract.
 */
export const appsConfigurationSystemCopyright: TAppsConfigurationCopyrights = {
  year: SystemDatetimeService.getYear(),
  // Who wrote the code? Do they contract it to the sponsor or is still theirs.
  code: appsConfigurationDeveloperSystemOrganisation.title,
  resources: appsConfigurationSponsorSystemOrganisation.title,
  media: appsConfigurationDistributorSystemOrganisation.title,
  contents: appsConfigurationSponsorSystemOrganisation.title

}
