/**
 * System Embargo Data Transfer Object
 * 
 * Represents a UN embargo or international sanction.
 * Maps to: base_system_Embargos table in JSON-server
 * 
 * Parent entity for CountriesExcluded.
 * Examples: "UN 1991 - Iraq", "UN 2017 - North Korea"
 */
export interface SystemEmbargoDto {
  id: string;
  enabled: boolean;
  title: string;
  description: string;
}
