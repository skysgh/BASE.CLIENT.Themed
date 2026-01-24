/**
 * Log Service
 * 
 * Business logic layer for log viewing.
 * Manages state, filtering, and data transformation.
 */
import { Injectable, inject, signal, computed } from '@angular/core';
import { LogRepository } from '../repositories/log.repository';
import { LogEntryMapper } from '../mappers/log-entry.mapper';
import { LogEntryViewModel } from '../models/log-entry.view-model';
import { LogFilterOptions, LogLevel } from '../models/log-entry.dto';

@Injectable({ providedIn: 'root' })
export class LogService {
  private repository = inject(LogRepository);
  
  // State
  private _logs = signal<LogEntryViewModel[]>([]);
  private _filter = signal<LogFilterOptions>({});
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  
  // Public state
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  
  // Filtered logs (computed)
  readonly filteredLogs = computed(() => {
    const logs = this._logs();
    const filter = this._filter();
    
    return logs.filter(log => {
      // Level filter
      if (filter.level && filter.level !== 'all' && log.level !== filter.level) {
        return false;
      }
      
      // Source filter
      if (filter.source && log.source !== filter.source) {
        return false;
      }
      
      // Search filter
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        const matchesMessage = log.message.toLowerCase().includes(searchLower);
        const matchesSource = log.source.toLowerCase().includes(searchLower);
        const matchesCorrelation = log.correlationId?.toLowerCase().includes(searchLower);
        if (!matchesMessage && !matchesSource && !matchesCorrelation) {
          return false;
        }
      }
      
      // Date range filter
      if (filter.startDate) {
        const start = new Date(filter.startDate);
        if (log.timestamp < start) return false;
      }
      if (filter.endDate) {
        const end = new Date(filter.endDate);
        if (log.timestamp > end) return false;
      }
      
      return true;
    });
  });
  
  // Statistics (computed)
  readonly stats = computed(() => {
    const logs = this._logs();
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const byLevel: Record<LogLevel, number> = {
      trace: 0, debug: 0, info: 0, warn: 0, error: 0, fatal: 0
    };
    
    let last24hTotal = 0;
    let last24hErrors = 0;
    const sourceCounts: Record<string, number> = {};
    
    for (const log of logs) {
      byLevel[log.level]++;
      sourceCounts[log.source] = (sourceCounts[log.source] || 0) + 1;
      
      if (log.timestamp >= oneDayAgo) {
        last24hTotal++;
        if (log.level === 'error' || log.level === 'fatal') {
          last24hErrors++;
        }
      }
    }
    
    const topSources = Object.entries(sourceCounts)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    return {
      total: logs.length,
      byLevel,
      last24hTotal,
      last24hErrors,
      topSources
    };
  });
  
  constructor() {
    // Load logs on service init
    this.loadLogs();
  }
  
  /**
   * Load all logs from repository
   */
  loadLogs(): void {
    this._loading.set(true);
    this._error.set(null);
    
    this.repository.getAll().subscribe({
      next: (dtos) => {
        const viewModels = LogEntryMapper.toViewModels(dtos);
        this._logs.set(viewModels);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set('Failed to load logs');
        this._loading.set(false);
        console.error('[LogService] Error loading logs:', err);
      }
    });
  }
  
  /**
   * Get a single log by ID
   */
  getLog(id: string): LogEntryViewModel | undefined {
    return this._logs().find(log => log.id === id);
  }
  
  /**
   * Set filter options
   */
  setFilter(filter: LogFilterOptions): void {
    this._filter.set(filter);
  }
  
  /**
   * Clear all filters
   */
  clearFilter(): void {
    this._filter.set({});
  }
  
  /**
   * Get unique sources from loaded logs
   */
  getUniqueSources(): string[] {
    const sources = new Set(this._logs().map(log => log.source));
    return Array.from(sources).sort();
  }
  
  /**
   * Refresh logs from repository
   */
  refresh(): void {
    this.loadLogs();
  }
}
