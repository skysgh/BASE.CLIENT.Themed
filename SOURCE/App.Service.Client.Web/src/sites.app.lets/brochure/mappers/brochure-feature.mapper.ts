import { BrochureFeatureDto } from '../models/dtos/brochure-feature.dto';
import { BrochureFeatureViewModel } from '../models/view-models/brochure-feature.view-model';

export function mapBrochureFeatureDtoToViewModel(dto: BrochureFeatureDto): BrochureFeatureViewModel {
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

export function mapBrochureFeatureViewModelToDto(vm: BrochureFeatureViewModel): Partial<BrochureFeatureDto> {
  return {
    id: vm.id,
    serviceId: vm.serviceId,
    enabled: vm.isEnabled,
    title: vm.title,
    description: vm.description,
    imageId: extractImageIdFromUrl(vm.imageUrl)
  };
}

export function mapBrochureFeatureDtosToViewModels(dtos: BrochureFeatureDto[]): BrochureFeatureViewModel[] {
  return dtos.map(mapBrochureFeatureDtoToViewModel);
}

function resolveImageUrl(imageId: string | undefined): string {
  if (!imageId) return '/assets/features/default.svg';
  if (imageId.startsWith('http') || imageId.startsWith('/')) return imageId;
  return `/assets/features/${imageId}`;
}

function extractImageIdFromUrl(imageUrl: string): string | undefined {
  if (!imageUrl || imageUrl === '/assets/features/default.svg') return undefined;
  const parts = imageUrl.split('/');
  return parts[parts.length - 1];
}

function generateCssClass(dto: BrochureFeatureDto): string {
  const classes: string[] = ['feature'];
  if (!dto.enabled) classes.push('feature--disabled');
  return classes.join(' ');
}
