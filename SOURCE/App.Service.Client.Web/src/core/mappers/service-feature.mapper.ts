import { ServiceFeatureDto } from '../models/dtos/service-feature.dto';
import { ServiceFeatureViewModel } from '../models/view-models/service-feature.view-model';

/**
 * Service Feature Mappers
 * 
 * Pure functions to transform between DTO (server data) and ViewModel (UI data).
 * 
 * **Pattern Benefits:**
 * - Pure functions (no side effects, easy to test)
 * - Explicit transformations (clear data flow)
 * - Type-safe conversions
 * - Single responsibility (just mapping)
 * 
 * **Usage:**
 * ```typescript
 * // In service
 * const dtos = await repository.getAll();
 * const viewModels = dtos.map(mapServiceFeatureDtoToViewModel);
 * 
 * // In reverse (save operation)
 * const dto = mapServiceFeatureViewModelToDto(viewModel);
 * await repository.update(dto.id, dto);
 * ```
 */

/**
 * Map ServiceFeatureDto → ServiceFeatureViewModel
 * 
 * Transforms server data to UI-friendly format:
 * - enabled → isEnabled
 * - imageId → imageUrl (with path resolution)
 * - Adds default values where needed
 * 
 * @param dto - Data from server/API
 * @returns UI-ready view model
 */
export function mapServiceFeatureDtoToViewModel(dto: ServiceFeatureDto): ServiceFeatureViewModel {
  return {
    id: dto.id,
    serviceId: dto.serviceId,
    isEnabled: dto.enabled,
    title: dto.title,
    description: dto.description,
    imageUrl: resolveImageUrl(dto.imageId),
    cssClass: generateCssClass(dto)
  };
}

/**
 * Map ServiceFeatureViewModel → ServiceFeatureDto
 * 
 * Transforms UI data back to server format for save operations.
 * 
 * @param vm - View model from UI
 * @returns Server-compatible DTO
 */
export function mapServiceFeatureViewModelToDto(vm: ServiceFeatureViewModel): Partial<ServiceFeatureDto> {
  return {
    id: vm.id,
    serviceId: vm.serviceId,
    enabled: vm.isEnabled,
    title: vm.title,
    description: vm.description,
    // imageId would be extracted from imageUrl if needed
    imageId: extractImageIdFromUrl(vm.imageUrl)
  };
}

/**
 * Map array of DTOs to ViewModels
 * 
 * @param dtos - Array of DTOs
 * @returns Array of ViewModels
 */
export function mapServiceFeatureDtosToViewModels(dtos: ServiceFeatureDto[]): ServiceFeatureViewModel[] {
  return dtos.map(mapServiceFeatureDtoToViewModel);
}

/**
 * Map array of ViewModels to DTOs
 * 
 * @param vms - Array of ViewModels
 * @returns Array of DTOs
 */
export function mapServiceFeatureViewModelsToDtos(vms: ServiceFeatureViewModel[]): Partial<ServiceFeatureDto>[] {
  return vms.map(mapServiceFeatureViewModelToDto);
}

// ============================================================================
// Helper Functions (Private)
// ============================================================================

/**
 * Resolve image URL from imageId
 * 
 * @param imageId - Optional image identifier
 * @returns Complete URL path to image
 */
function resolveImageUrl(imageId: string | undefined): string {
  if (!imageId) {
    return '/assets/features/default.svg';
  }

  // If imageId already looks like a URL, return as-is
  if (imageId.startsWith('http') || imageId.startsWith('/')) {
    return imageId;
  }

  // Otherwise, construct path
  return `/assets/features/${imageId}`;
}

/**
 * Extract imageId from imageUrl
 * 
 * @param imageUrl - Complete image URL
 * @returns Image identifier (filename)
 */
function extractImageIdFromUrl(imageUrl: string): string | undefined {
  if (!imageUrl || imageUrl === '/assets/features/default.svg') {
    return undefined;
  }

  // Extract filename from URL
  const parts = imageUrl.split('/');
  return parts[parts.length - 1];
}

/**
 * Generate CSS class based on feature properties
 * 
 * @param dto - Feature DTO
 * @returns CSS class string
 */
function generateCssClass(dto: ServiceFeatureDto): string {
  const classes: string[] = ['feature'];
  
  if (!dto.enabled) {
    classes.push('feature--disabled');
  }
  
  return classes.join(' ');
}
