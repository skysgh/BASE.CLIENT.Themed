/**
 * Architecture Quality Type View Model
 * 
 * UI-friendly representation of an ISO quality standard.
 * Enriched from ArchitectureQualityTypeDto by mapper for optimal UI consumption.
 * 
 * Architecture:
 * - ViewModels are optimized for UI/component use
 * - May include computed/derived properties
 * - Immutable (components read, don't mutate)
 * - Created by mappers from DTOs
 * - Consumed by Signal-based services
 */
export interface ArchitectureQualityTypeViewModel {
  /**
   * Unique identifier (UUID format)
   */
  readonly id: string;

  /**
   * ISO standard name
   * Examples: "ISO-25010", "ISO-25012", "ISO-25022"
   */
  readonly title: string;

  /**
   * Description of what this standard covers
   */
  readonly description?: string;

  /**
   * Display label (same as title for ISO standards)
   * Example: "ISO-25010"
   */
  readonly displayLabel: string;

  /**
   * ISO standard number only
   * Example: "ISO-25010" → "25010"
   */
  readonly standardNumber: string;
}
