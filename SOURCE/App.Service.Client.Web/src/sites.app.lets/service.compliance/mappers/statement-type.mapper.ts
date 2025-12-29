import { StatementTypeDto } from '../models/dtos/statement-type.dto';
import { StatementTypeViewModel } from '../models/view-models/statement-type.view-model';

export function mapStatementTypeDtoToViewModel(dto: StatementTypeDto): StatementTypeViewModel {
  return {
    id: dto.id,
    enabled: dto.enabled,
    code: dto.code,
    name: dto.title,
    description: dto.description,
    displayOrder: dto.displayOrder ?? 0,
    displayLabel: `${dto.title} (${dto.code})`
  };
}

export function mapStatementTypeDtosToViewModels(dtos: StatementTypeDto[]): StatementTypeViewModel[] {
  return dtos.map(mapStatementTypeDtoToViewModel);
}
