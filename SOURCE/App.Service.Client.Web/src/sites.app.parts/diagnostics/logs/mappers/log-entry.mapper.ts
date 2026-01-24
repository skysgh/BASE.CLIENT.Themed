/**
 * Log Entry Mapper
 * 
 * Maps between DTO and ViewModel for log entries.
 */
import { LogEntryDto, LOG_LEVELS } from '../models/log-entry.dto';
import { LogEntryViewModel, getRelativeTime, formatTimestamp } from '../models/log-entry.view-model';

export class LogEntryMapper {
  /**
   * Map DTO to ViewModel
   */
  static toViewModel(dto: LogEntryDto): LogEntryViewModel {
    const timestamp = new Date(dto.timestamp);
    const levelMeta = LOG_LEVELS[dto.level];
    
    return {
      // Core data
      id: dto.id,
      timestamp,
      level: dto.level,
      source: dto.source,
      message: dto.message,
      
      // Optional data
      details: dto.details,
      correlationId: dto.correlationId,
      userId: dto.userId,
      accountId: dto.accountId,
      userAgent: dto.userAgent,
      stackTrace: dto.stackTrace,
      
      // Computed display properties
      timestampDisplay: formatTimestamp(timestamp),
      relativeTime: getRelativeTime(timestamp),
      levelLabel: levelMeta.label,
      levelColor: levelMeta.color,
      levelIcon: levelMeta.icon,
      hasDetails: !!dto.details && Object.keys(dto.details).length > 0,
      hasStackTrace: !!dto.stackTrace
    };
  }
  
  /**
   * Map array of DTOs to ViewModels
   */
  static toViewModels(dtos: LogEntryDto[]): LogEntryViewModel[] {
    return dtos.map(dto => this.toViewModel(dto));
  }
  
  /**
   * Map ViewModel back to DTO (for API calls)
   */
  static toDto(vm: LogEntryViewModel): LogEntryDto {
    return {
      id: vm.id,
      timestamp: vm.timestamp.toISOString(),
      level: vm.level,
      source: vm.source,
      message: vm.message,
      details: vm.details,
      correlationId: vm.correlationId,
      userId: vm.userId,
      accountId: vm.accountId,
      userAgent: vm.userAgent,
      stackTrace: vm.stackTrace
    };
  }
}
