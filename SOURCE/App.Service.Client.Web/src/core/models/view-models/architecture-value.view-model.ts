/**
 * Architecture Value View Model
 * 
 * UI-friendly representation of an architectural value.
 * Enriched from ArchitectureValueDto by mapper for optimal UI consumption.
 * 
 * Architecture:
 * - ViewModels are optimized for UI/component use
 * - May include computed/derived properties
 * - Immutable (components read, don't mutate)
 * - Created by mappers from DTOs
 * - Consumed by Signal-based services
 */
export interface ArchitectureValueViewModel {
  /**
   * Unique identifier (UUID format)
   */
  readonly id: string;

  /**
   * Value name (lowercase)
   * Examples: "honesty", "trustworthiness", "inclusive"
   */
  readonly title: string;

  /**
   * Optional description explaining the value
   */
  readonly description?: string;

  /**
   * Display label (title case for UI)
   * Example: "honesty" → "Honesty"
   */
  readonly displayLabel: string;
}
