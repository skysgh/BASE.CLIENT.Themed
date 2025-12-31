import { AccountProfileDto } from '../models/account-profile.dto';
import { 
  AccountProfileViewModel, 
  computeMembershipStatus, 
  formatMemberDuration 
} from '../models/account-profile.view-model';

/**
 * Account Profile Mapper
 */
export class AccountProfileMapper {
  
  static toViewModel(dto: AccountProfileDto): AccountProfileViewModel {
    const joinedAt = new Date(dto.joinedAt);
    const expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : null;
    const status = computeMembershipStatus(dto.isActive, expiresAt, joinedAt);
    
    return {
      id: dto.id,
      userId: dto.userId,
      accountId: dto.accountId,
      joinedAt,
      isActive: dto.isActive,
      expiresAt,
      displayNameOverride: dto.displayNameOverride,
      jobTitle: dto.jobTitle,
      department: dto.department,
      lastAccessedAt: dto.lastAccessedAt ? new Date(dto.lastAccessedAt) : null,
      favoriteItemIds: dto.favoriteItemIds || [],
      collapsedSections: dto.collapsedSections || [],
      dashboardLayout: dto.dashboardLayout,
      notificationsEnabled: dto.notificationsEnabled,
      notificationDigest: dto.notificationDigest,
      membershipStatus: status.status,
      membershipStatusClass: status.cssClass,
      memberDuration: formatMemberDuration(joinedAt)
    };
  }
  
  static toViewModels(dtos: AccountProfileDto[]): AccountProfileViewModel[] {
    return dtos.map(dto => this.toViewModel(dto));
  }
}
