/**
 * Architecture Principle Type View Model
 * 
 * UI-friendly representation of an architectural principle type.
 * Enriched from ArchitecturePrincipleTypeDto by mapper for optimal UI consumption.
 * 
 * Architecture:
 * - ViewModels are optimized for UI/component use
 * - May include computed/derived properties
 * - Immutable (components read, don't mutate)
 * - Created by mappers from DTOs
 * - Consumed by Signal-based services
 */
export interface ArchitecturePrincipleTypeViewModel {
  /**
   * Unique identifier (UUID format)
   */
  readonly id: string;

  /**
   * Type name (lowercase)
   * Examples: "business", "security", "design"
   */
  readonly title: string;

  /**
   * Optional description explaining the principle type
   */
  readonly description?: string;

  /**
   * Display label (title case for UI)
   * Example: "business" → "Business"
   */
  readonly displayLabel: string;
}
