import { ServiceProductDto } from '../models/dtos/service-product.dto';
import { ServiceProductViewModel } from '../models/view-models/service-product.view-model';

export function mapServiceProductDtoToViewModel(dto: ServiceProductDto): ServiceProductViewModel {
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

export function mapServiceProductDtosToViewModels(dtos: ServiceProductDto[]): ServiceProductViewModel[] {
  return dtos.map(dto => mapServiceProductDtoToViewModel(dto));
}

export function mapServiceProductViewModelToDto(viewModel: ServiceProductViewModel): ServiceProductDto {
  return {
    id: viewModel.id,
    title: viewModel.name,
    description: viewModel.description,
    price: viewModel.priceAmount.toString(),
    currency: viewModel.currency
  };
}
