/**
 * Log Repository
 * 
 * Data access layer for log entries.
 * Currently uses fake data; will connect to API later.
 */
import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { LogEntryDto, LogLevel } from '../models/log-entry.dto';

@Injectable({ providedIn: 'root' })
export class LogRepository {
  
  /**
   * Fetch all logs from API
   */
  getAll(): Observable<LogEntryDto[]> {
    // TODO: Replace with HTTP call
    return of(this.generateFakeLogs()).pipe(delay(300));
  }
  
  /**
   * Fetch single log by ID
   */
  getById(id: string): Observable<LogEntryDto | null> {
    const logs = this.generateFakeLogs();
    const log = logs.find(l => l.id === id) || null;
    return of(log).pipe(delay(200));
  }
  
  /**
   * Generate fake log data for development
   */
  private generateFakeLogs(): LogEntryDto[] {
    const sources = ['AuthService', 'ApiClient', 'Router', 'FormValidator', 'DataSync', 'CacheManager'];
    const levels: LogLevel[] = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];
    
    const messages: Record<LogLevel, string[]> = {
      trace: ['Method entry: processRequest', 'Cache lookup for key: user_123', 'Event emitted: stateChange'],
      debug: ['Request payload validated', 'Response received in 45ms', 'Component initialized'],
      info: ['User signed in successfully', 'Data sync completed', 'Configuration loaded'],
      warn: ['Rate limit approaching threshold', 'Deprecated API used', 'Slow query detected (2.3s)'],
      error: ['Failed to fetch user data: 404', 'Form validation failed', 'Network request timeout'],
      fatal: ['Database connection lost', 'Critical configuration missing', 'Unhandled exception in main thread']
    };
    
    const logs: LogEntryDto[] = [];
    const now = new Date();
    
    for (let i = 0; i < 100; i++) {
      const level = levels[Math.floor(Math.random() * levels.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      const messageList = messages[level];
      const message = messageList[Math.floor(Math.random() * messageList.length)];
      
      const timestamp = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      
      const log: LogEntryDto = {
        id: `log-${i.toString().padStart(4, '0')}`,
        timestamp: timestamp.toISOString(),
        level,
        source,
        message,
        correlationId: Math.random() > 0.7 ? `corr-${Math.random().toString(36).substring(7)}` : undefined,
        userId: Math.random() > 0.5 ? `user-${Math.floor(Math.random() * 100)}` : undefined,
        accountId: 'demo-account'
      };
      
      // Add details for some logs
      if (Math.random() > 0.7) {
        log.details = {
          duration: Math.floor(Math.random() * 1000),
          endpoint: '/api/v1/data',
          statusCode: level === 'error' ? 500 : 200
        };
      }
      
      // Add stack trace for errors
      if ((level === 'error' || level === 'fatal') && Math.random() > 0.5) {
        log.stackTrace = `Error: ${message}
    at ${source}.process (${source.toLowerCase()}.ts:42:15)
    at async Router.handle (router.ts:128:9)
    at async Application.run (app.ts:56:3)`;
      }
      
      logs.push(log);
    }
    
    // Sort by timestamp descending (newest first)
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}
