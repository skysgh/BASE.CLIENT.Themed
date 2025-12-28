import { SystemUserDto } from '../models/dtos/system-user.dto';
import { SystemUserViewModel } from '../models/view-models/system-user.view-model';

export function mapSystemUserDtoToViewModel(dto: SystemUserDto): SystemUserViewModel {
  return {
    id: dto.id,
    email: dto.email,
    displayName: dto.displayName,
    role: dto.role,
    enabled: dto.enabled
  };
}

export function mapSystemUserDtosToViewModels(dtos: SystemUserDto[]): SystemUserViewModel[] {
  return dtos.map(mapSystemUserDtoToViewModel);
}
