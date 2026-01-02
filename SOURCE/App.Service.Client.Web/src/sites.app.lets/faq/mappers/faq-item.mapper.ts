/**
 * FAQ Item Mapper
 * 
 * Maps DTOs to ViewModels.
 */
import { FaqItemDto } from '../models/faq-item.dto';
import { FaqItemViewModel } from '../models/faq-item.view-model';

/**
 * Truncate text with ellipsis
 */
function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Map DTO to ViewModel
 */
export function mapFaqItemDtoToViewModel(
  dto: FaqItemDto,
  categoryTitle?: string
): FaqItemViewModel {
  return {
    id: dto.id,
    categoryId: dto.categoryId,
    categoryTitle,
    question: dto.question,
    answer: dto.answer,
    order: dto.order,
    enabled: dto.enabled,
    cultureCode: dto.cultureCode,
    tags: dto.tags || [],
    createdAt: new Date(dto.createdUtc),
    updatedAt: new Date(dto.updatedUtc),
    answerPreview: truncate(dto.answer, 100),
    displayLabel: dto.question,
  };
}

/**
 * Map array of DTOs to ViewModels
 */
export function mapFaqItemDtosToViewModels(
  dtos: FaqItemDto[],
  categoryTitles: Record<string, string> = {}
): FaqItemViewModel[] {
  return dtos
    .map(dto => mapFaqItemDtoToViewModel(dto, categoryTitles[dto.categoryId]))
    .sort((a, b) => a.order - b.order);
}

/**
 * Map ViewModel back to DTO (for create/update)
 */
export function mapFaqItemViewModelToDto(vm: Partial<FaqItemViewModel>): Partial<FaqItemDto> {
  const now = new Date().toISOString();
  return {
    id: vm.id,
    categoryId: vm.categoryId,
    question: vm.question,
    answer: vm.answer,
    order: vm.order,
    enabled: vm.enabled ?? true,
    cultureCode: vm.cultureCode ?? 'en',
    tags: vm.tags,
    updatedUtc: now,
  };
}
