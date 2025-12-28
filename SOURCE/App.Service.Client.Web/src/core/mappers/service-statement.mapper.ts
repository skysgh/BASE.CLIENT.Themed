import { ServiceStatementDto } from '../models/dtos/service-statement.dto';
import { ServiceStatementViewModel } from '../models/view-models/service-statement.view-model';

export function mapServiceStatementDtoToViewModel(
  dto: ServiceStatementDto,
  typeName?: string
): ServiceStatementViewModel {
  const encodingTypeLower = dto.encodingTypeId?.toLowerCase() || '';
  
  return {
    id: dto.id,
    typeId: dto.typeId,
    typeName: typeName,
    encodingTypeId: dto.encodingTypeId,
    languageCode: dto.languageCode,
    issuedDate: new Date(dto.issuedUtc),
    title: dto.title,
    content: dto.text,
    displayLabel: dto.title,
    isHtml: encodingTypeLower.includes('html'),
    isMarkdown: encodingTypeLower.includes('markdown')
  };
}

export function mapServiceStatementDtosToViewModels(
  dtos: ServiceStatementDto[],
  getTypeName: (typeId: string) => string = () => 'Unknown'
): ServiceStatementViewModel[] {
  return dtos.map(dto => mapServiceStatementDtoToViewModel(dto, getTypeName(dto.typeId)));
}

export function mapServiceStatementViewModelToDto(viewModel: ServiceStatementViewModel): ServiceStatementDto {
  return {
    id: viewModel.id,
    typeId: viewModel.typeId,
    encodingTypeId: viewModel.encodingTypeId,
    languageCode: viewModel.languageCode,
    issuedUtc: viewModel.issuedDate.toISOString(),
    title: viewModel.title,
    text: viewModel.content
  };
}
