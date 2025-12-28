/**
 * System Country Excluded View Model
 */
export interface SystemCountryExcludedViewModel {
  id: string;
  embargoId: string;
  countryName: string;
  description: string;
  ipRange?: string;
  displayLabel: string;
  embargoReference?: string;
}
