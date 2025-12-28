/**
 * Spike View Model
 * 
 * UI-friendly representation of a Spike entity.
 * Enriched from SpikeDto by mapper for optimal UI consumption.
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
 * spikes = spikeService.spikes(); // Signal<SpikeViewModel[]>
 * 
 * // In template:
 * @for (spike of spikes(); track spike.id) {
 *   <div>{{ spike.title }}</div>
 * }
 * ```
 */
export interface SpikeViewModel {
  /**
   * Unique identifier (UUID format)
   */
  readonly id: string;

  /**
   * Spike title/name
   * Example: "Spike.Foo", "Spike.Bar"
   */
  readonly title: string;

  /**
   * Optional description
   */
  readonly description?: string;

  /**
   * Display label (computed from title)
   * Removes "Spike." prefix for cleaner UI
   * Example: "Spike.Foo" → "Foo"
   */
  readonly displayLabel: string;
}
