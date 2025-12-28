import { ProductTypeDto } from '../models/dtos/product-type.dto';
import { ProductTypeViewModel } from '../models/view-models/product-type.view-model';

export function mapProductTypeDtoToViewModel(dto: ProductTypeDto): ProductTypeViewModel {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    displayLabel: dto.title
  };
}

export function mapProductTypeDtosToViewModels(dtos: ProductTypeDto[]): ProductTypeViewModel[] {
  return dtos.map(mapProductTypeDtoToViewModel);
}

export function mapProductTypeViewModelToDto(vm: ProductTypeViewModel): ProductTypeDto {
  return {
    id: vm.id,
    title: vm.title,
    description: vm.description
  };
}
