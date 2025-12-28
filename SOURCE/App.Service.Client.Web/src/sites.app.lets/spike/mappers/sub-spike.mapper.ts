import { SubSpikeDto } from '../models/dtos/sub-spike.dto';
import { SubSpikeViewModel } from '../models/view-models/sub-spike.view-model';

/**
 * SubSpike Mapper
 * 
 * Transforms between DTOs (API data) and ViewModels (UI data).
 * Part of the repository pattern: Repository → Mapper → Service → Component
 * 
 * Responsibilities:
 * - Map DTO → ViewModel (for display)
 * - Map ViewModel → DTO (for saving)
 * - Add computed/derived properties (displayLabel, level)
 * - Transform hierarchical data for optimal UI consumption
 * 
 * Architecture:
 * - Pure functions (no side effects)
 * - Stateless (no dependencies, no constructor)
 * - Used by services to transform repository data
 * - Single source of truth for DTO ↔ ViewModel transformation
 * 
 * @example
 * ```typescript
 * // In service:
 * this.repository.getByParentId(spikeId).pipe(
 *   map(dtos => mapSubSpikeDtosToViewModels(dtos))
 * ).subscribe(viewModels => {
 *   this.subSpikes.set(viewModels);
 * });
 * ```
 */

/**
 * Map single SubSpike DTO to ViewModel
 * 
 * Transformations:
 * - Renames parentFK → parentId (more UI-friendly)
 * - Creates displayLabel by removing "SubSpike.{Parent}." prefix
 * - Calculates level (1 for now, could be computed from hierarchy)
 * - Makes all properties readonly
 * 
 * @param dto SubSpike DTO from API
 * @returns SubSpikeViewModel Enriched view model for UI
 */
export function mapSubSpikeDtoToViewModel(dto: SubSpikeDto): SubSpikeViewModel {
  return {
    id: dto.id,
    parentId: dto.parentFK, // Rename for UI clarity
    title: dto.title,
    description: dto.description,
    displayLabel: extractDisplayLabel(dto.title),
    level: 1 // First level child (could be computed if deeper hierarchy exists)
  };
}

/**
 * Map array of SubSpike DTOs to ViewModels
 * 
 * @param dtos Array of SubSpike DTOs from API
 * @returns SubSpikeViewModel[] Array of view models for UI
 */
export function mapSubSpikeDtosToViewModels(dtos: SubSpikeDto[]): SubSpikeViewModel[] {
  return dtos.map(dto => mapSubSpikeDtoToViewModel(dto));
}

/**
 * Map ViewModel back to DTO (for saving)
 * 
 * Removes computed properties (displayLabel, level)
 * Renames parentId → parentFK
 * Keeps only properties that exist in the API
 * 
 * @param viewModel SubSpike view model from UI
 * @returns SubSpikeDto DTO ready for API
 */
export function mapSubSpikeViewModelToDto(viewModel: SubSpikeViewModel): SubSpikeDto {
  return {
    id: viewModel.id,
    parentFK: viewModel.parentId, // Rename back to API field name
    title: viewModel.title,
    description: viewModel.description
  };
}

/**
 * Helper: Extract clean display label from title
 * 
 * Removes common prefixes for cleaner UI display
 * 
 * Examples:
 * - "SubSpike.Foo.Foo" → "Foo"
 * - "SubSpike.Bar.Bar" → "Bar"
 * - "CustomName" → "CustomName" (no prefix, return as-is)
 * 
 * Algorithm:
 * 1. Split by "."
 * 2. Return last segment (most specific part)
 * 
 * @param title Original title from API
 * @returns string Cleaned display label
 */
function extractDisplayLabel(title: string): string {
  // Split by "." and take the last segment
  const parts = title.split('.');
  return parts[parts.length - 1];
}
