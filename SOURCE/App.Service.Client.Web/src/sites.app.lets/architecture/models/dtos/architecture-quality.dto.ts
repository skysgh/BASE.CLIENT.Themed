/**
 * Architecture Quality Data Transfer Object
 * 
 * Represents a specific quality requirement as received from the API.
 * Maps to: app_architecture_Qualities table in JSON-server
 */
export interface ArchitectureQualityDto {
  id: string;
  categoryFk: string;
  title: string;
  description?: string;
}
