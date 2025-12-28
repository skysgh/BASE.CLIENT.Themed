/**
 * Architecture Principle Type Data Transfer Object
 * 
 * Represents a category/type of architectural principle as received from the API.
 * Maps to: app_architecture_PrincipleTypes table in JSON-server
 * 
 * Principle types categorize principles into domains.
 * Examples: business, enterprise, delivery, security, design
 * 
 * Relationship:
 * - Parent of ArchitecturePrinciple (one-to-many)
 * - Referenced by Principle.typeFk
 * 
 * Architecture:
 * - DTOs represent raw API data structure
 * - No business logic (pure data containers)
 * - Used by repositories when fetching/saving data
 * - Mapped to ViewModels by mappers for UI consumption
 * 
 * Example JSON:
 * ```json
 * {
 *   "id": "00000000-0000-0000-0000-000000000008",
 *   "title": "design",
 *   "description": "..."
 * }
 * ```
 */
export interface ArchitecturePrincipleTypeDto {
  /**
   * Unique identifier (UUID format)
   */
  id: string;

  /**
   * Type name (lowercase)
   * Examples: "business", "security", "design", "development"
   */
  title: string;

  /**
   * Optional description explaining the principle type
   */
  description?: string;
}
