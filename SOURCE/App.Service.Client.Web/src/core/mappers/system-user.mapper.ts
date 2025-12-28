import { SystemUserDto } from '../models/dtos/system-user.dto';
import { SystemUserViewModel } from '../models/view-models/system-user.view-model';

export function mapSystemUserDtoToViewModel(dto: SystemUserDto): SystemUserViewModel {
  return {
    id: dto.id,
    username: dto.title,
    description: dto.description,
    identityId: dto.identityFK,
    displayLabel: dto.title,
    role: dto.description
  };
}

export function mapSystemUserDtosToViewModels(dtos: SystemUserDto[]): SystemUserViewModel[] {
  return dtos.map(dto => mapSystemUserDtoToViewModel(dto));
}

export function mapSystemUserViewModelToDto(viewModel: SystemUserViewModel): SystemUserDto {
  return {
    id: viewModel.id,
    title: viewModel.username,
    description: viewModel.description,
    identityFK: viewModel.identityId
  };
}
