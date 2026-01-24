/**
 * Log Entry DTO
 * 
 * Represents a single diagnostic log entry.
 */
export interface LogEntryDto {
  /** Unique identifier */
  id: string;
  
  /** When the log was created */
  timestamp: string;
  
  /** Log severity level */
  level: LogLevel;
  
  /** Component or service that created the log */
  source: string;
  
  /** Log message */
  message: string;
  
  /** Additional structured data */
  details?: Record<string, any>;
  
  /** Correlation ID for request tracing */
  correlationId?: string;
  
  /** User ID if applicable */
  userId?: string;
  
  /** Account/tenant ID */
  accountId?: string;
  
  /** Browser/client info */
  userAgent?: string;
  
  /** Stack trace for errors */
  stackTrace?: string;
}

/**
 * Log severity levels
 */
export type LogLevel = 
  | 'trace'  // Most verbose
  | 'debug'  // Debug information
  | 'info'   // General information
  | 'warn'   // Warning conditions
  | 'error'  // Error conditions
  | 'fatal'; // Critical failures

/**
 * Log level metadata
 */
export const LOG_LEVELS: Record<LogLevel, { label: string; color: string; icon: string }> = {
  trace: { label: 'Trace', color: 'secondary', icon: 'ri-code-line' },
  debug: { label: 'Debug', color: 'info', icon: 'ri-bug-line' },
  info:  { label: 'Info',  color: 'primary', icon: 'ri-information-line' },
  warn:  { label: 'Warn',  color: 'warning', icon: 'ri-alert-line' },
  error: { label: 'Error', color: 'danger', icon: 'ri-error-warning-line' },
  fatal: { label: 'Fatal', color: 'dark', icon: 'ri-skull-line' }
};

/**
 * Log filter options
 */
export interface LogFilterOptions {
  level?: LogLevel | 'all';
  source?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  correlationId?: string;
}

/**
 * Log statistics
 */
export interface LogStats {
  total: number;
  byLevel: Record<LogLevel, number>;
  last24hTotal: number;
  last24hErrors: number;
  topSources: { source: string; count: number }[];
}
