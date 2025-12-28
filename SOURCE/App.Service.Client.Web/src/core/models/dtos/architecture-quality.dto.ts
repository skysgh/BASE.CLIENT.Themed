/**
 * Architecture Quality Data Transfer Object
 * 
 * Represents a specific quality requirement as received from the API.
 * Maps to: app_architecture_Qualities table in JSON-server
 * 
 * Qualities are concrete, testable requirements derived from ISO standards.
 * Examples: "The solution's system(s) MUST...", specific quality metrics
 * 
 * Relationship:
 * - Child of ArchitectureQualityCategory (many-to-one via categoryFk)
 * - Most granular level of the quality hierarchy
 * 
 * Hierarchy:
 * QualityType (ISO-25010)
 *   → QualityCategory (Functionality)
 *     → Quality (Specific requirement)
 * 
 * Architecture:
 * - DTOs represent raw API data structure
 * - No business logic (pure data containers)
 * - Foreign key (categoryFk) references parent QualityCategory
 * - Mapped to ViewModels by mappers for UI consumption
 * 
 * Example JSON:
 * ```json
 * {
 *   "id": "00000000-0000-0000-0000-000000000001",
 *   "categoryFk": "00000000-0000-0000-0000-000000000001",
 *   "title": "The solution's system(s) MUST..etc.",
 *   "description": "etc..."
 * }
 * ```
 */
export interface ArchitectureQualityDto {
  /**
   * Unique identifier (UUID format)
   */
  id: string;

  /**
   * Foreign key to parent QualityCategory
   * References: ArchitectureQualityCategory.id
   */
  categoryFk: string;

  /**
   * Quality requirement statement
   * Usually starts with "The solution's system(s) MUST..."
   */
  title: string;

  /**
   * Detailed description or acceptance criteria
   */
  description?: string;
}
