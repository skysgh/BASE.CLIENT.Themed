/**
 * Spike Data Transfer Object
 * 
 * Represents a spike entity as received from the API.
 * Maps to: app_spike_Spikes table in JSON-server
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
 *   "title": "Spike.Foo",
 *   "description": "...some desc..."
 * }
 * ```
 */
export interface SpikeDto {
  /**
   * Unique identifier (UUID format)
   */
  id: string;

  /**
   * Spike title/name
   * Example: "Spike.Foo", "Spike.Bar"
   */
  title: string;

  /**
   * Optional description
   */
  description?: string;
}
