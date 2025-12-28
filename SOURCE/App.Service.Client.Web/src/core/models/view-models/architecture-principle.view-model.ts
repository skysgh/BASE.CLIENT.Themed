/**
 * Architecture Principle View Model
 * 
 * UI-friendly representation of an architectural principle.
 * Enriched from ArchitecturePrincipleDto by mapper for optimal UI consumption.
 * 
 * Relationship:
 * - Child of ArchitecturePrincipleTypeViewModel
 * - typeId references parent PrincipleType
 * 
 * Architecture:
 * - ViewModels are optimized for UI/component use
 * - May include computed/derived properties (displayLabel, category)
 * - Immutable (components read, don't mutate)
 * - Created by mappers from DTOs
 * - Consumed by Signal-based services
 */
export interface ArchitecturePrincipleViewModel {
  /**
   * Unique identifier (UUID format)
   */
  readonly id: string;

  /**
   * Parent PrincipleType ID
   * References: ArchitecturePrincipleTypeViewModel.id
   */
  readonly typeId: string;

  /**
   * Principle name
   * Examples: "Security-first", "API-first"
   */
  readonly title: string;

  /**
   * Detailed description explaining the principle
   */
  readonly description?: string;

  /**
   * Display label (same as title)
   */
  readonly displayLabel: string;

  /**
   * Category name from parent type (computed)
   * Example: "design", "security"
   * Useful for grouping in UI
   */
  readonly category: string;
}
