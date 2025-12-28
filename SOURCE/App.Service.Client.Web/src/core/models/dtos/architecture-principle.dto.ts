/**
 * Architecture Principle Data Transfer Object
 * 
 * Represents an architectural principle as received from the API.
 * Maps to: app_architecture_Principles table in JSON-server
 * 
 * Principles are high-level design rules that guide system development.
 * Examples: "Security-first", "API-first", "Accessible-first"
 * 
 * Relationship:
 * - Child of ArchitecturePrincipleType (many-to-one via typeFk)
 * - Categorized by type (business, security, design, etc.)
 * 
 * Architecture:
 * - DTOs represent raw API data structure
 * - No business logic (pure data containers)
 * - Foreign key (typeFk) references parent PrincipleType
 * - Mapped to ViewModels by mappers for UI consumption
 * 
 * Example JSON:
 * ```json
 * {
 *   "id": "00000000-0000-0000-0000-000000000001",
 *   "typeFk": "00000000-0000-0000-0000-000000000008",
 *   "title": "Security-first",
 *   "description": "Ensuring what users entrust to the system remains safe"
 * }
 * ```
 */
export interface ArchitecturePrincipleDto {
  /**
   * Unique identifier (UUID format)
   */
  id: string;

  /**
   * Foreign key to parent PrincipleType
   * References: ArchitecturePrincipleType.id
   */
  typeFk: string;

  /**
   * Principle name
   * Examples: "Security-first", "API-first", "Accessible-first"
   */
  title: string;

  /**
   * Detailed description explaining the principle
   */
  description?: string;
}
