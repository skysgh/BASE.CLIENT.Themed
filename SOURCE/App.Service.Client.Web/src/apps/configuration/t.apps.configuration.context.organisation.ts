import { IHasTitleAndDescription } from "../../core/models/contracts/IHasTitleAndDescription";
import { TAppsContextOrganisationChannel } from "./t.apps.configuration.context.organisation.channel";




/**
 * Contract for describing an organisation
 * involved with the system (Sponsor, Developer, etc.)
 * (title, description, purpose, tel?, email?, postal)
 */
export type TAppsConfigurationContextOrganisation = IHasTitleAndDescription & {
  /**
   * Contact details for the organisation.
   */
  channels: TAppsContextOrganisationChannel;
}
