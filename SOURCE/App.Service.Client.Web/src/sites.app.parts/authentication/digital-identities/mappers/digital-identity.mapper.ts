import { DigitalIdentityDto } from '../models/digital-identity.dto';
import { 
  DigitalIdentityViewModel, 
  getProviderInfo, 
  formatLastUsed 
} from '../models/digital-identity.view-model';

/**
 * Digital Identity Mapper
 */
export class DigitalIdentityMapper {
  
  static toViewModel(dto: DigitalIdentityDto): DigitalIdentityViewModel {
    const lastAuth = dto.lastAuthenticatedAt ? new Date(dto.lastAuthenticatedAt) : null;
    const providerInfo = getProviderInfo(dto.providerId);
    
    return {
      id: dto.id,
      userId: dto.userId,
      providerId: dto.providerId as any,
      externalUserId: dto.externalUserId,
      externalEmail: dto.externalEmail,
      externalDisplayName: dto.externalDisplayName,
      linkedAt: new Date(dto.linkedAt),
      lastAuthenticatedAt: lastAuth,
      enabled: dto.enabled,
      isPrimary: dto.isPrimary,
      providerName: providerInfo.name,
      providerIcon: providerInfo.icon,
      lastUsedLabel: formatLastUsed(lastAuth)
    };
  }
  
  static toViewModels(dtos: DigitalIdentityDto[]): DigitalIdentityViewModel[] {
    return dtos.map(dto => this.toViewModel(dto));
  }
}
