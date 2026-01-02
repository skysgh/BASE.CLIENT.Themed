/**
 * FAQ Category Mapper
 * 
 * Maps DTOs to ViewModels.
 */
import { FaqCategoryDto } from '../models/faq-category.dto';
import { FaqCategoryViewModel } from '../models/faq-category.view-model';
import { getIconClass } from '../constants';

/**
 * Map DTO to ViewModel
 */
export function mapFaqCategoryDtoToViewModel(
  dto: FaqCategoryDto, 
  itemCount: number = 0
): FaqCategoryViewModel {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description || '',
    icon: dto.icon,
    iconClass: getIconClass(dto.icon as any) || `bx ${dto.icon}`,
    order: dto.order,
    enabled: dto.enabled,
    cultureCode: dto.cultureCode,
    createdAt: new Date(dto.createdUtc),
    updatedAt: new Date(dto.updatedUtc),
    itemCount,
    displayLabel: dto.title,
  };
}

/**
 * Map array of DTOs to ViewModels
 */
export function mapFaqCategoryDtosToViewModels(
  dtos: FaqCategoryDto[],
  itemCounts: Record<string, number> = {}
): FaqCategoryViewModel[] {
  return dtos
    .map(dto => mapFaqCategoryDtoToViewModel(dto, itemCounts[dto.id] || 0))
    .sort((a, b) => a.order - b.order);
}

/**
 * Map ViewModel back to DTO (for create/update)
 */
export function mapFaqCategoryViewModelToDto(vm: Partial<FaqCategoryViewModel>): Partial<FaqCategoryDto> {
  const now = new Date().toISOString();
  return {
    id: vm.id,
    title: vm.title,
    description: vm.description,
    icon: vm.icon,
    order: vm.order,
    enabled: vm.enabled ?? true,
    cultureCode: vm.cultureCode ?? 'en',
    updatedUtc: now,
  };
}
