import { UserDto, CreateUserDto, UpdateUserDto } from '../models/user.dto';
import { UserViewModel, computeUserStatus } from '../models/user.view-model';

/**
 * User Mapper
 * 
 * Maps between DTOs and ViewModels for User entities.
 */
export class UserMapper {
  
  /**
   * Map DTO to ViewModel
   */
  static toViewModel(dto: UserDto): UserViewModel {
    const validFrom = dto.validFrom ? new Date(dto.validFrom) : null;
    const validTo = dto.validTo ? new Date(dto.validTo) : null;
    const status = computeUserStatus(dto.enabled, validFrom, validTo);
    
    return {
      id: dto.id,
      personId: dto.personId,
      enabled: dto.enabled,
      validFrom,
      validTo,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
      isCurrentlyValid: status.isValid,
      statusLabel: status.label,
      statusClass: status.cssClass
    };
  }
  
  /**
   * Map array of DTOs to ViewModels
   */
  static toViewModels(dtos: UserDto[]): UserViewModel[] {
    return dtos.map(dto => this.toViewModel(dto));
  }
}
