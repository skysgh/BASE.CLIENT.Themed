/**
 * System Country Excluded Data Transfer Object
 * 
 * Represents a country excluded due to an embargo.
 * Maps to: base_System_CountriesExcluded table in JSON-server
 * 
 * Child entity of SystemEmbargo.
 * Examples: "Iraq", "North Korea", "Iran"
 */
export interface SystemCountryExcludedDto {
  id: string;
  embargoFk: string;
  title: string;
  description: string;
  range?: string;
}
