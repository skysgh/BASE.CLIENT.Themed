import { TAppsConfigurationContextOrganisationChannelPostal } from "./t.apps.configuration.context.organisation.channel.postal";

/**
 * Contract to describe a communication channel
 * with an organisation or person.
 */
export type TAppsContextOrganisationChannel = {
  /**
   * (Optional) telephone number
   */
  tel: string ,
  //// Later
  //tel: {
  //  "main"?: string
  //}
  /**
   * (Optional) email address
   */
  email: string|undefined,
  /**
   *  Postal Address
  */
  postal: TAppsConfigurationContextOrganisationChannelPostal,

  // Later:
//  postal: {
//    "main": IPostalCommsChannel
//  }
}
