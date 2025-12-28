import { AgreementTypeDto } from '../models/dtos/agreement-type.dto';
import { AgreementTypeViewModel } from '../models/view-models/agreement-type.view-model';

export function mapAgreementTypeDtoToViewModel(dto: AgreementTypeDto): AgreementTypeViewModel {
  return {
    id: dto.id,
    title: dto.title,
    languageCode: dto.languageCode,
    issuedDate: new Date(dto.issuedUtc),
    content: dto.text,
    displayLabel: dto.title
  };
}

export function mapAgreementTypeDtosToViewModels(dtos: AgreementTypeDto[]): AgreementTypeViewModel[] {
  return dtos.map(dto => mapAgreementTypeDtoToViewModel(dto));
}

export function mapAgreementTypeViewModelToDto(viewModel: AgreementTypeViewModel): AgreementTypeDto {
  return {
    id: viewModel.id,
    title: viewModel.title,
    languageCode: viewModel.languageCode,
    issuedUtc: viewModel.issuedDate.toISOString(),
    text: viewModel.content
  };
}
