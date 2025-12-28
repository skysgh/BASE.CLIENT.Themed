/**
 * SubSpike View Model
 * 
 * UI-friendly representation of a SubSpike entity.
 * Enriched from SubSpikeDto by mapper for optimal UI consumption.
 * 
 * Relationship:
 * - Child of SpikeViewModel (hierarchical)
 * - parentId references parent Spike
 * 
 * Architecture:
 * - ViewModels are optimized for UI/component use
 * - May include computed/derived properties
 * - Immutable (components read, don't mutate)
 * - Created by mappers from DTOs
 * - Consumed by Signal-based services
 * 
 * Usage:
 * ```typescript
 * // In component:
 * subSpikes = subSpikeService.getByParentId(spikeId);
 * 
 * // In template:
 * @for (subSpike of subSpikes(); track subSpike.id) {
 *   <div>{{ subSpike.displayLabel }}</div>
 * }
 * ```
 */
export interface SubSpikeViewModel {
  /**
   * Unique identifier (UUID format)
   */
  readonly id: string;

  /**
   * Parent Spike ID
   * References: SpikeViewModel.id
   */
  readonly parentId: string;

  /**
   * Sub-spike title/name
   * Example: "SubSpike.Foo.Foo", "SubSpike.Bar.Bar"
   */
  readonly title: string;

  /**
   * Optional description
   */
  readonly description?: string;

  /**
   * Display label (computed from title)
   * Removes "SubSpike.{Parent}." prefix for cleaner UI
   * Example: "SubSpike.Foo.Foo" → "Foo"
   */
  readonly displayLabel: string;

  /**
   * Level indicator (for hierarchical display)
   * Example: 1 = first level child
   */
  readonly level: number;
}
