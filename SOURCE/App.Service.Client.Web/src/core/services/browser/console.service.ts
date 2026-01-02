import { Injectable, isDevMode } from '@angular/core';

/**
 * Log Level Enum
 */
export enum LogLevel {
  Debug = 0,
  Verbose = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  None = 5
}

/**
 * ConsoleService
 * 
 * Wrapper around browser's console API.
 * 
 * WHY THIS EXISTS:
 * 1. Testability - Can mock/spy on console calls in tests
 * 2. SSR Safety - Handles environments where console may not exist
 * 3. Level Control - Can disable logging by level (e.g., no debug in prod)
 * 4. Formatting - Consistent log format with timestamps and prefixes
 * 5. Grouping - Group related logs together
 * 6. Future: Can send logs to remote logging service
 * 
 * LEVELS:
 * - Debug: Development details (API calls, state changes)
 * - Verbose: Detailed operational logs
 * - Info: Operational messages (user actions, lifecycle)
 * - Warn: Potential issues (deprecated APIs, fallbacks used)
 * - Error: Actual errors (exceptions, failed operations)
 * 
 * USAGE:
 * ```typescript
 * this.console.debug('Loading user', { id: 123 });
 * this.console.info('User logged in');
 * this.console.warn('API is deprecated');
 * this.console.error('Failed to load', error);
 * 
 * this.console.group('Initialization');
 * this.console.info('Step 1');
 * this.console.info('Step 2');
 * this.console.groupEnd();
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class ConsoleService {
  private minLevel: LogLevel;
  private readonly enableTimestamps: boolean = true;
  private readonly prefix: string = '';

  constructor() {
    // In dev mode, show all logs. In prod, only warnings and errors.
    this.minLevel = isDevMode() ? LogLevel.Debug : LogLevel.Warn;
  }

  // ============================================
  // Configuration
  // ============================================

  /**
   * Set minimum log level
   * Logs below this level will be suppressed
   */
  setLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  /**
   * Get current log level
   */
  getLevel(): LogLevel {
    return this.minLevel;
  }

  /**
   * Check if a log level is enabled
   */
  isLevelEnabled(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  // ============================================
  // Core Logging Methods
  // ============================================

  /**
   * Debug level - development details
   */
  debug(message: string, ...args: any[]): void {
    if (!this.isLevelEnabled(LogLevel.Debug)) return;
    this.log('debug', message, args);
  }

  /**
   * Verbose level - detailed operational logs
   */
  verbose(message: string, ...args: any[]): void {
    if (!this.isLevelEnabled(LogLevel.Verbose)) return;
    this.log('log', message, args);
  }

  /**
   * Info level - operational messages
   */
  info(message: string, ...args: any[]): void {
    if (!this.isLevelEnabled(LogLevel.Info)) return;
    this.log('info', message, args);
  }

  /**
   * Warn level - potential issues
   */
  warn(message: string, ...args: any[]): void {
    if (!this.isLevelEnabled(LogLevel.Warn)) return;
    this.log('warn', message, args);
  }

  /**
   * Error level - actual errors
   */
  error(message: string, ...args: any[]): void {
    if (!this.isLevelEnabled(LogLevel.Error)) return;
    this.log('error', message, args);
  }

  // ============================================
  // Structured Logging
  // ============================================

  /**
   * Log with context object
   */
  logWithContext(level: LogLevel, message: string, context: Record<string, any>): void {
    if (!this.isLevelEnabled(level)) return;
    
    const method = this.levelToMethod(level);
    const formatted = this.format(message);
    console[method](formatted, context);
  }

  /**
   * Log a table (arrays/objects)
   */
  table(data: any): void {
    if (!this.isLevelEnabled(LogLevel.Debug)) return;
    if (typeof console.table === 'function') {
      console.table(data);
    } else {
      console.log(data);
    }
  }

  /**
   * Log with timing
   */
  time(label: string): void {
    if (!this.isLevelEnabled(LogLevel.Debug)) return;
    console.time(label);
  }

  timeEnd(label: string): void {
    if (!this.isLevelEnabled(LogLevel.Debug)) return;
    console.timeEnd(label);
  }

  // ============================================
  // Grouping
  // ============================================

  /**
   * Start a collapsed group
   */
  group(label: string): void {
    if (!this.isLevelEnabled(LogLevel.Debug)) return;
    console.groupCollapsed(this.format(label));
  }

  /**
   * Start an expanded group
   */
  groupExpanded(label: string): void {
    if (!this.isLevelEnabled(LogLevel.Debug)) return;
    console.group(this.format(label));
  }

  /**
   * End the current group
   */
  groupEnd(): void {
    if (!this.isLevelEnabled(LogLevel.Debug)) return;
    console.groupEnd();
  }

  // ============================================
  // Assertions & Debugging
  // ============================================

  /**
   * Assert - logs error if condition is false
   */
  assert(condition: boolean, message: string, ...args: any[]): void {
    if (!this.isLevelEnabled(LogLevel.Error)) return;
    console.assert(condition, this.format(message), ...args);
  }

  /**
   * Trace - prints stack trace
   */
  trace(message?: string): void {
    if (!this.isLevelEnabled(LogLevel.Debug)) return;
    console.trace(message ? this.format(message) : undefined);
  }

  /**
   * Clear console
   */
  clear(): void {
    console.clear();
  }

  // ============================================
  // Private Helpers
  // ============================================

  private log(method: 'debug' | 'log' | 'info' | 'warn' | 'error', message: string, args: any[]): void {
    const formatted = this.format(message);
    if (args.length > 0) {
      console[method](formatted, ...args);
    } else {
      console[method](formatted);
    }
  }

  private format(message: string): string {
    if (this.enableTimestamps) {
      const timestamp = new Date().toISOString().substring(11, 23); // HH:mm:ss.SSS
      return `[${timestamp}] ${this.prefix}${message}`;
    }
    return `${this.prefix}${message}`;
  }

  private levelToMethod(level: LogLevel): 'debug' | 'log' | 'info' | 'warn' | 'error' {
    switch (level) {
      case LogLevel.Debug: return 'debug';
      case LogLevel.Verbose: return 'log';
      case LogLevel.Info: return 'info';
      case LogLevel.Warn: return 'warn';
      case LogLevel.Error: return 'error';
      default: return 'log';
    }
  }
}
