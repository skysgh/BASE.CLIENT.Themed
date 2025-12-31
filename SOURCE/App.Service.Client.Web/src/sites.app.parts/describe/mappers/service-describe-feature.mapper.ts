import { ServiceDescribeFeatureDto } from '../models/dtos/service-describe-feature.dto';
import { ServiceDescribeFeatureViewModel } from '../models/view-models/service-describe-feature.view-model';

export function mapServiceDescribeFeatureDtoToViewModel(dto: ServiceDescribeFeatureDto): ServiceDescribeFeatureViewModel {
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

export function mapServiceDescribeFeatureViewModelToDto(vm: ServiceDescribeFeatureViewModel): Partial<ServiceDescribeFeatureDto> {
  return {
    id: vm.id,
    serviceId: vm.serviceId,
    enabled: vm.isEnabled,
    title: vm.title,
    description: vm.description,
    imageId: extractImageIdFromUrl(vm.imageUrl)
  };
}

export function mapServiceDescribeFeatureDtosToViewModels(dtos: ServiceDescribeFeatureDto[]): ServiceDescribeFeatureViewModel[] {
  return dtos.map(mapServiceDescribeFeatureDtoToViewModel);
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

function generateCssClass(dto: ServiceDescribeFeatureDto): string {
  const classes: string[] = ['feature'];
  if (!dto.enabled) classes.push('feature--disabled');
  return classes.join(' ');
}
