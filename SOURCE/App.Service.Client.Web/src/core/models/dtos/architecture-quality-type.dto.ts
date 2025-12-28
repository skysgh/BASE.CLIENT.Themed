/**
 * Architecture Quality Type Data Transfer Object
 * 
 * Represents an ISO quality standard as received from the API.
 * Maps to: app_architecture_QualityTypes table in JSON-server
 * 
 * Quality types represent international standards for system quality.
 * Examples: ISO-25010 (System Qualities), ISO-25012 (Data Qualities), ISO-25022 (UX Qualities)
 * 
 * Relationship:
 * - Parent of ArchitectureQualityCategory (one-to-many)
 * - Referenced by QualityCategory.typeFk
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
 *   "title": "ISO-25010",
 *   "description": "System Qualities"
 * }
 * ```
 */
export interface ArchitectureQualityTypeDto {
  /**
   * Unique identifier (UUID format)
   */
  id: string;

  /**
   * ISO standard name
   * Examples: "ISO-25010", "ISO-25012", "ISO-25022"
   */
  title: string;

  /**
   * Description of what this standard covers
   * Examples: "System Qualities", "System Data Qualities", "System User Experience Qualities"
   */
  description?: string;
}
