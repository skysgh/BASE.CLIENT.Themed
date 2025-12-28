import { SystemStatementTypeDto } from '../models/dtos/system-statement-type.dto';
import { SystemStatementTypeViewModel } from '../models/view-models/system-statement-type.view-model';

export function mapSystemStatementTypeDtoToViewModel(dto: SystemStatementTypeDto): SystemStatementTypeViewModel {
  return {
    id: dto.id,
    code: dto.code,
    title: dto.title,
    description: dto.description,
    displayLabel: dto.title
  };
}

export function mapSystemStatementTypeDtosToViewModels(dtos: SystemStatementTypeDto[]): SystemStatementTypeViewModel[] {
  return dtos.map(mapSystemStatementTypeDtoToViewModel);
}
