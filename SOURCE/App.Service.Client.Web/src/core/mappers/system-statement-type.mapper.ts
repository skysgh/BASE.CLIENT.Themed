import { SystemStatementTypeDto } from '../models/dtos/system-statement-type.dto';
import { SystemStatementTypeViewModel } from '../models/view-models/system-statement-type.view-model';

export function mapSystemStatementTypeDtoToViewModel(dto: SystemStatementTypeDto): SystemStatementTypeViewModel {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    displayLabel: dto.title,
    categoryKey: dto.title.toLowerCase().replace(/\s+/g, '-')
  };
}

export function mapSystemStatementTypeDtosToViewModels(dtos: SystemStatementTypeDto[]): SystemStatementTypeViewModel[] {
  return dtos.map(dto => mapSystemStatementTypeDtoToViewModel(dto));
}

export function mapSystemStatementTypeViewModelToDto(viewModel: SystemStatementTypeViewModel): SystemStatementTypeDto {
  return {
    id: viewModel.id,
    title: viewModel.title,
    description: viewModel.description
  };
}
