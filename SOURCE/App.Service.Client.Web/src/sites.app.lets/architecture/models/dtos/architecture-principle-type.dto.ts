/**
 * Architecture Principle Type Data Transfer Object
 * 
 * Represents a category/type of architectural principle as received from the API.
 * Maps to: app_architecture_PrincipleTypes table in JSON-server
 */
export interface ArchitecturePrincipleTypeDto {
  id: string;
  title: string;
  description?: string;
}
