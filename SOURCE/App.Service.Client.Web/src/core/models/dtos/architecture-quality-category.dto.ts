/**
 * Architecture Quality Category Data Transfer Object
 * 
 * Represents a quality category within an ISO standard as received from the API.
 * Maps to: app_architecture_QualityCategories table in JSON-server
 * 
 * Quality categories subdivide ISO standards into specific areas.
 * Examples: "ISO-25010/Functionality", "ISO-25010/Usability", "ISO-25010/Security"
 * 
 * Relationship:
 * - Child of ArchitectureQualityType (many-to-one via typeFk)
 * - Parent of ArchitectureQuality (one-to-many)
 * - Referenced by Quality.categoryFk
 * 
 * Architecture:
 * - DTOs represent raw API data structure
 * - No business logic (pure data containers)
 * - Foreign key (typeFk) references parent QualityType
 * - Mapped to ViewModels by mappers for UI consumption
 * 
 * Example JSON:
 * ```json
 * {
 *   "id": "00000000-0000-0000-0000-000000000001",
 *   "typeFk": "00000000-0000-0000-0000-000000000001",
 *   "title": "ISO-25010/Functionality",
 *   "description": "Qualities of Functionality"
 * }
 * ```
 */
export interface ArchitectureQualityCategoryDto {
  /**
   * Unique identifier (UUID format)
   */
  id: string;

  /**
   * Foreign key to parent QualityType
   * References: ArchitectureQualityType.id
   */
  typeFk: string;

  /**
   * Category name (includes ISO standard prefix)
   * Examples: "ISO-25010/Functionality", "ISO-25010/Usability"
   */
  title: string;

  /**
   * Description of what this category covers
   */
  description?: string;
}
