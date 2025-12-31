import { AccountDto } from '../models/dtos/account.dto';
import { AccountViewModel } from '../models/view-models/account.view-model';

export function mapAccountDtoToViewModel(dto: AccountDto): AccountViewModel {
  const createdAt = new Date(dto.createdUtc);
  const modifiedAt = dto.modifiedUtc ? new Date(dto.modifiedUtc) : undefined;
  const now = new Date();
  const ageInDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    id: dto.id,
    accountGuid: dto.accountGuid,
    name: dto.name,
    title: dto.title,
    subtitle: dto.subtitle || '',
    enabled: dto.enabled,
    createdAt: createdAt,
    modifiedAt: modifiedAt,
    
    // Branding
    logoLight: dto.logoLight || '/assets/images/logo-light.svg',
    logoDark: dto.logoDark || '/assets/images/logo-dark.svg',
    primaryColor: dto.primaryColor || '#007bff',
    secondaryColor: dto.secondaryColor || '#6c757d',
    
    // Contact
    contactEmail: dto.contactEmail || '',
    supportEmail: dto.supportEmail || '',
    
    // Settings
    defaultLanguageCode: dto.defaultLanguageCode || 'en',
    timezone: dto.timezone || 'UTC',
    
    // Computed
    displayLabel: `${dto.title} (${dto.name})`,
    isActive: dto.enabled,
    ageInDays: ageInDays
  };
}

export function mapAccountDtosToViewModels(dtos: AccountDto[]): AccountViewModel[] {
  return dtos.map(mapAccountDtoToViewModel);
}

export function mapAccountViewModelToDto(vm: AccountViewModel): AccountDto {
  return {
    id: vm.id,
    accountGuid: vm.accountGuid,
    name: vm.name,
    title: vm.title,
    subtitle: vm.subtitle || undefined,
    enabled: vm.enabled,
    createdUtc: vm.createdAt.toISOString(),
    modifiedUtc: vm.modifiedAt?.toISOString(),
    logoLight: vm.logoLight,
    logoDark: vm.logoDark,
    primaryColor: vm.primaryColor,
    secondaryColor: vm.secondaryColor,
    contactEmail: vm.contactEmail || undefined,
    supportEmail: vm.supportEmail || undefined,
    defaultLanguageCode: vm.defaultLanguageCode,
    timezone: vm.timezone
  };
}
