/**
 * Architecture Quality Category View Model
 * 
 * UI-friendly representation of a quality category within an ISO standard.
 * Enriched from ArchitectureQualityCategoryDto by mapper for optimal UI consumption.
 * 
 * Relationship:
 * - Child of ArchitectureQualityTypeViewModel
 * - Parent of ArchitectureQualityViewModel
 * - typeId references parent QualityType
 * 
 * Architecture:
 * - ViewModels are optimized for UI/component use
 * - May include computed/derived properties (shortName, standardRef)
 * - Immutable (components read, don't mutate)
 * - Created by mappers from DTOs
 * - Consumed by Signal-based services
 */
export interface ArchitectureQualityCategoryViewModel {
  /**
   * Unique identifier (UUID format)
   */
  readonly id: string;

  /**
   * Parent QualityType ID
   * References: ArchitectureQualityTypeViewModel.id
   */
  readonly typeId: string;

  /**
   * Category name (includes ISO standard prefix)
   * Examples: "ISO-25010/Functionality", "ISO-25010/Usability"
   */
  readonly title: string;

  /**
   * Description of what this category covers
   */
  readonly description?: string;

  /**
   * Display label (same as title)
   */
  readonly displayLabel: string;

  /**
   * Short name (without ISO prefix)
   * Example: "ISO-25010/Functionality" → "Functionality"
   */
  readonly shortName: string;

  /**
   * ISO standard reference (from title)
   * Example: "ISO-25010/Functionality" → "ISO-25010"
   */
  readonly standardRef: string;
}
