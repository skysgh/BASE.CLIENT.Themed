/**
 * Architecture Principle Data Transfer Object
 * 
 * Represents an architectural principle as received from the API.
 * Maps to: app_architecture_Principles table in JSON-server
 */
export interface ArchitecturePrincipleDto {
  id: string;
  typeFk: string;
  title: string;
  description?: string;
}
