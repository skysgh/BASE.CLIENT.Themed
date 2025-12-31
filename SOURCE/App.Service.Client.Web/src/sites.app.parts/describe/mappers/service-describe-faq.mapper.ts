import { ServiceDescribeFaqDto } from '../models/dtos/service-describe-faq.dto';
import { ServiceDescribeFaqViewModel } from '../models/view-models/service-describe-faq.view-model';

export function mapServiceDescribeFaqDtoToViewModel(dto: ServiceDescribeFaqDto): ServiceDescribeFaqViewModel {
  return {
    id: dto.id,
    question: dto.title,
    answer: dto.description,
    categoryId: dto.categoryId,
    enabled: dto.enabled
  };
}

export function mapServiceDescribeFaqViewModelToDto(vm: ServiceDescribeFaqViewModel): ServiceDescribeFaqDto {
  return {
    id: vm.id,
    title: vm.question,
    description: vm.answer,
    categoryId: vm.categoryId,
    enabled: vm.enabled
  };
}

export function mapServiceDescribeFaqDtosToViewModels(dtos: ServiceDescribeFaqDto[]): ServiceDescribeFaqViewModel[] {
  return dtos.map(mapServiceDescribeFaqDtoToViewModel);
}
