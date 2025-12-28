/**
 * Architecture Value Data Transfer Object
 * 
 * Represents a core business/architectural value as received from the API.
 * Maps to: app_architecture_Values table in JSON-server
 */
export interface ArchitectureValueDto {
  id: string;
  title: string;
  description?: string;
}
