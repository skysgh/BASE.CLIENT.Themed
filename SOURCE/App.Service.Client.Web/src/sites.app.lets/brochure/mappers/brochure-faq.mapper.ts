import { BrochureFaqDto } from '../models/dtos/brochure-faq.dto';
import { BrochureFaqViewModel } from '../models/view-models/brochure-faq.view-model';

export function mapBrochureFaqDtoToViewModel(dto: BrochureFaqDto): BrochureFaqViewModel {
  return {
    id: dto.id,
    question: dto.title,
    answer: dto.description,
    categoryId: dto.categoryId,
    enabled: dto.enabled
  };
}

export function mapBrochureFaqViewModelToDto(vm: BrochureFaqViewModel): BrochureFaqDto {
  return {
    id: vm.id,
    title: vm.question,
    description: vm.answer,
    categoryId: vm.categoryId,
    enabled: vm.enabled
  };
}

export function mapBrochureFaqDtosToViewModels(dtos: BrochureFaqDto[]): BrochureFaqViewModel[] {
  return dtos.map(mapBrochureFaqDtoToViewModel);
}
