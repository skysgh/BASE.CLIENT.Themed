import { SystemProfileDto } from '../models/system-profile.dto';
import { 
  SystemProfileViewModel, 
  resolveSystemTheme, 
  getFontSizeClass 
} from '../models/system-profile.view-model';

/**
 * System Profile Mapper
 */
export class SystemProfileMapper {
  
  static toViewModel(dto: SystemProfileDto): SystemProfileViewModel {
    return {
      id: dto.id,
      userId: dto.userId,
      theme: dto.theme,
      languageCode: dto.languageCode,
      locale: dto.locale,
      timezone: dto.timezone,
      reduceMotion: dto.reduceMotion,
      highContrast: dto.highContrast,
      fontSize: dto.fontSize,
      defaultAccountId: dto.defaultAccountId,
      lastAccessedAccountId: dto.lastAccessedAccountId,
      emailNotifications: dto.emailNotifications,
      pushNotifications: dto.pushNotifications,
      marketingEmails: dto.marketingEmails,
      effectiveTheme: resolveSystemTheme(dto.theme),
      fontSizeClass: getFontSizeClass(dto.fontSize)
    };
  }
}
