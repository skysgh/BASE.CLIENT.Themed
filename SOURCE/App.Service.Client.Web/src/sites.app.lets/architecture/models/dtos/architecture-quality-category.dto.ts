/**
 * Architecture Quality Category Data Transfer Object
 * 
 * Represents a quality category within an ISO standard as received from the API.
 * Maps to: app_architecture_QualityCategories table in JSON-server
 */
export interface ArchitectureQualityCategoryDto {
  id: string;
  typeFk: string;
  title: string;
  description?: string;
}
