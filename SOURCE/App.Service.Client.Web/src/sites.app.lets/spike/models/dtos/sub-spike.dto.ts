/**
 * SubSpike Data Transfer Object
 * 
 * Represents a sub-spike entity as received from the API.
 * Maps to: app_spike_SubSpikes table in JSON-server
 * 
 * Relationship:
 * - Child of Spike (many-to-one via parentFK)
 * - Hierarchical structure (spikes contain sub-spikes)
 * 
 * Architecture:
 * - DTOs represent raw API data structure
 * - No business logic (pure data containers)
 * - Foreign key (parentFK) references parent Spike
 * - Mapped to ViewModels by mappers for UI consumption
 * 
 * Example JSON:
 * ```json
 * {
 *   "id": "00000000-0000-0000-0000-000000000001",
 *   "parentFK": "00000000-0000-0000-0000-000000000001",
 *   "title": "SubSpike.Foo.Foo",
 *   "description": "..."
 * }
 * ```
 */
export interface SubSpikeDto {
  /**
   * Unique identifier (UUID format)
   */
  id: string;

  /**
   * Foreign key to parent Spike
   * References: Spike.id
   */
  parentFK: string;

  /**
   * Sub-spike title/name
   * Example: "SubSpike.Foo.Foo", "SubSpike.Bar.Bar"
   */
  title: string;

  /**
   * Optional description
   */
  description?: string;
}
