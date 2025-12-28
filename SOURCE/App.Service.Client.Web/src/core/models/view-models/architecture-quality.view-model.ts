/**
 * Architecture Quality View Model
 * 
 * UI-friendly representation of a specific quality requirement.
 * Enriched from ArchitectureQualityDto by mapper for optimal UI consumption.
 * 
 * Relationship:
 * - Child of ArchitectureQualityCategoryViewModel
 * - categoryId references parent QualityCategory
 * - Most granular level of quality hierarchy
 * 
 * Architecture:
 * - ViewModels are optimized for UI/component use
 * - May include computed/derived properties (requirementType, priority)
 * - Immutable (components read, don't mutate)
 * - Created by mappers from DTOs
 * - Consumed by Signal-based services
 */
export interface ArchitectureQualityViewModel {
  /**
   * Unique identifier (UUID format)
   */
  readonly id: string;

  /**
   * Parent QualityCategory ID
   * References: ArchitectureQualityCategoryViewModel.id
   */
  readonly categoryId: string;

  /**
   * Quality requirement statement
   * Usually starts with "The solution's system(s) MUST..."
   */
  readonly title: string;

  /**
   * Detailed description or acceptance criteria
   */
  readonly description?: string;

  /**
   * Display label (same as title)
   */
  readonly displayLabel: string;

  /**
   * Requirement type (computed from title)
   * Example: "MUST", "SHOULD", "MAY"
   * Extracted from "The solution's system(s) MUST..."
   */
  readonly requirementType: string;
}
