import { AgreementDto } from '../models/dtos/agreement.dto';
import { AgreementViewModel } from '../models/view-models/agreement.view-model';

export function mapAgreementDtoToViewModel(dto: AgreementDto, typeName?: string): AgreementViewModel {
  return {
    id: dto.id,
    typeId: dto.typeId,
    typeName: typeName,
    encodingTypeId: dto.encodingTypeId,
    languageCode: dto.languageCode,
    issuedDate: new Date(dto.issuedUtc),
    title: dto.title,
    content: dto.text,
    displayLabel: dto.title
  };
}

export function mapAgreementDtosToViewModels(
  dtos: AgreementDto[],
  getTypeName: (typeId: string) => string = () => 'Unknown'
): AgreementViewModel[] {
  return dtos.map(dto => mapAgreementDtoToViewModel(dto, getTypeName(dto.typeId)));
}

export function mapAgreementViewModelToDto(viewModel: AgreementViewModel): AgreementDto {
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
