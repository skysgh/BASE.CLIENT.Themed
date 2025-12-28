/**
 * Architecture Quality Type Data Transfer Object
 * 
 * Represents an ISO quality standard as received from the API.
 * Maps to: app_architecture_QualityTypes table in JSON-server
 */
export interface ArchitectureQualityTypeDto {
  id: string;
  title: string;
  description?: string;
}
