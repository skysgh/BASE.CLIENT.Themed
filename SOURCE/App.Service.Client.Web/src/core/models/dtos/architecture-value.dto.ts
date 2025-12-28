/**
 * Architecture Value Data Transfer Object
 * 
 * Represents a core business/architectural value as received from the API.
 * Maps to: app_architecture_Values table in JSON-server
 * 
 * Values are the fundamental beliefs that guide architectural decisions.
 * Examples: honesty, trustworthiness, inclusive, constructive
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
 *   "id": "00000000-0000-0000-0000-000000000001",
 *   "title": "honesty",
 *   "description": "..."
 * }
 * ```
 */
export interface ArchitectureValueDto {
  /**
   * Unique identifier (UUID format)
   */
  id: string;

  /**
   * Value name (lowercase)
   * Examples: "honesty", "trustworthiness", "inclusive"
   */
  title: string;

  /**
   * Optional description explaining the value
   */
  description?: string;
}
