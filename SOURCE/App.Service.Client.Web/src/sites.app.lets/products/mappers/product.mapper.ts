import { ProductDto } from '../models/dtos/product.dto';
import { ProductViewModel } from '../models/view-models/product.view-model';

export function mapProductDtoToViewModel(dto: ProductDto): ProductViewModel {
  const priceAmount = parseFloat(dto.price) || 0;
  const formattedPrice = `${dto.currency} ${priceAmount.toFixed(2)}`;
  
  return {
    id: dto.id,
    name: dto.title,
    description: dto.description,
    priceAmount: priceAmount,
    currency: dto.currency,
    displayLabel: dto.title,
    formattedPrice: formattedPrice
  };
}

export function mapProductDtosToViewModels(dtos: ProductDto[]): ProductViewModel[] {
  return dtos.map(mapProductDtoToViewModel);
}

export function mapProductViewModelToDto(vm: ProductViewModel): ProductDto {
  return {
    id: vm.id,
    title: vm.name,
    description: vm.description,
    price: vm.priceAmount.toString(),
    currency: vm.currency
  };
}
