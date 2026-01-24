/**
 * Log Entry View Model
 * 
 * Presentation model for log entries with computed display properties.
 */
import { LogLevel, LOG_LEVELS } from './log-entry.dto';

export interface LogEntryViewModel {
  // Core data
  id: string;
  timestamp: Date;
  level: LogLevel;
  source: string;
  message: string;
  
  // Optional data
  details?: Record<string, any>;
  correlationId?: string;
  userId?: string;
  accountId?: string;
  userAgent?: string;
  stackTrace?: string;
  
  // Computed display properties
  timestampDisplay: string;
  relativeTime: string;
  levelLabel: string;
  levelColor: string;
  levelIcon: string;
  hasDetails: boolean;
  hasStackTrace: boolean;
}

/**
 * Get relative time string (e.g., "2 minutes ago")
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour} hr ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(date: Date): string {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}
