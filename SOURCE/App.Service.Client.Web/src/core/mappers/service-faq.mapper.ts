import { ServiceFaqDto } from '../models/dtos/service-faq.dto';
import { ServiceFaqViewModel } from '../models/view-models/service-faq.view-model';

/**
 * Map ServiceFaq DTO to ViewModel
 * 
 * Transforms API data to UI-friendly structure.
 * Pure function with no side effects.
 * 
 * @param dto - FAQ data from API
 * @returns UI-optimized FAQ view model
 */
export function mapServiceFaqDtoToViewModel(dto: ServiceFaqDto): ServiceFaqViewModel {
  return {
    id: dto.id,
    question: dto.title,
    answer: dto.description,
    categoryId: dto.categoryId,
    enabled: dto.enabled
  };
}

/**
 * Map ServiceFaq ViewModel to DTO
 * 
 * Transforms UI data back to API structure.
 * Used for create/update operations.
 * 
 * @param vm - FAQ view model from UI
 * @returns API-compatible FAQ DTO
 */
export function mapServiceFaqViewModelToDto(vm: ServiceFaqViewModel): ServiceFaqDto {
  return {
    id: vm.id,
    title: vm.question,
    description: vm.answer,
    categoryId: vm.categoryId,
    enabled: vm.enabled
  };
}

/**
 * Map array of ServiceFaq DTOs to ViewModels
 * 
 * @param dtos - Array of FAQ DTOs
 * @returns Array of FAQ view models
 */
export function mapServiceFaqDtosToViewModels(dtos: ServiceFaqDto[]): ServiceFaqViewModel[] {
  return dtos.map(mapServiceFaqDtoToViewModel);
}
