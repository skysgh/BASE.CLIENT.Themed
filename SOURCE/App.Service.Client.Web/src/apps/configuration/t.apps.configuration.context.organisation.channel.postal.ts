/** Contract for a Postal form of communication channel */
export type TAppsConfigurationContextOrganisationChannelPostal = {
  /**
   * Street address (Number and street name).
   */
  street: string,
  /**
   * Optional second line of address (apartment number, etc.)
   */
  street2: string|undefined,
  /**
   * City or town.
   */
  city: string,
  /**
   * State, province, or region.
   */
  region: string,
  /**
   * Postal code or ZIP code.
   */
  code: string,
  /**
   * Country name.
   */
  country: string
}
