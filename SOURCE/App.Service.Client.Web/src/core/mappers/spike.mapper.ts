import { SpikeDto } from '../models/dtos/spike.dto';
import { SpikeViewModel } from '../models/view-models/spike.view-model';

/**
 * Spike Mapper
 * 
 * Transforms between DTOs (API data) and ViewModels (UI data).
 * Part of the repository pattern: Repository → Mapper → Service → Component
 * 
 * Responsibilities:
 * - Map DTO → ViewModel (for display)
 * - Map ViewModel → DTO (for saving)
 * - Add computed/derived properties
 * - Transform data for optimal UI consumption
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
 * this.repository.getAll().pipe(
 *   map(dtos => mapSpikeDtosToViewModels(dtos))
 * ).subscribe(viewModels => {
 *   this.spikes.set(viewModels);
 * });
 * ```
 */

/**
 * Map single Spike DTO to ViewModel
 * 
 * Transformations:
 * - Creates displayLabel by removing "Spike." prefix
 * - Makes all properties readonly
 * - Adds UI-friendly computed properties
 * 
 * @param dto Spike DTO from API
 * @returns SpikeViewModel Enriched view model for UI
 */
export function mapSpikeDtoToViewModel(dto: SpikeDto): SpikeViewModel {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    displayLabel: extractDisplayLabel(dto.title)
  };
}

/**
 * Map array of Spike DTOs to ViewModels
 * 
 * @param dtos Array of Spike DTOs from API
 * @returns SpikeViewModel[] Array of view models for UI
 */
export function mapSpikeDtosToViewModels(dtos: SpikeDto[]): SpikeViewModel[] {
  return dtos.map(dto => mapSpikeDtoToViewModel(dto));
}

/**
 * Map ViewModel back to DTO (for saving)
 * 
 * Removes computed properties (displayLabel)
 * Keeps only properties that exist in the API
 * 
 * @param viewModel Spike view model from UI
 * @returns SpikeDto DTO ready for API
 */
export function mapSpikeViewModelToDto(viewModel: SpikeViewModel): SpikeDto {
  return {
    id: viewModel.id,
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
 * - "Spike.Foo" → "Foo"
 * - "Spike.Bar" → "Bar"
 * - "CustomName" → "CustomName" (no prefix, return as-is)
 * 
 * @param title Original title from API
 * @returns string Cleaned display label
 */
function extractDisplayLabel(title: string): string {
  // Remove "Spike." prefix if present
  if (title.startsWith('Spike.')) {
    return title.substring(6); // Remove "Spike."
  }
  return title;
}
