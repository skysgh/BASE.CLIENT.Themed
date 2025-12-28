import { Injectable, signal, computed } from '@angular/core';
import { ServiceNotificationRepository } from '../repositories/service-notification.repository';
import { ServiceNotificationViewModel } from '../models/view-models/service-notification.view-model';
import { mapServiceNotificationDtosToViewModels } from '../mappers/service-notification.mapper';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

/**
 * ServiceNotification Service - LIVE/POLLING Pattern
 * 
 * Demonstrates automatic polling for real-time updates.
 * Polls every 60 seconds for new notifications.
 */
@Injectable({ providedIn: 'root' })
export class ServiceNotificationService {
  notifications = signal<ServiceNotificationViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  // Computed signal for badge count
  unreadCount = computed(() => 
    this.notifications().filter(n => n.enabled).length
  );
  
  enabledNotifications = computed(() => 
    this.notifications().filter(n => n.enabled)
  );
  
  constructor(
    private repository: ServiceNotificationRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized - Polling every 60s`);
    
    console.log('[DEBUG] ServiceNotificationService: Subscribing to live$');
    
    // ✅ CORRECT: Subscribe to live$ observable (auto-polls every 60s)
    this.repository.live$.subscribe({
      next: (dtos) => {
        console.log('[DEBUG] ServiceNotificationService: Received DTOs', dtos);
        const viewModels = mapServiceNotificationDtosToViewModels(dtos);
        console.log('[DEBUG] ServiceNotificationService: Mapped to ViewModels', viewModels);
        this.notifications.set(viewModels);
        this.logger.debug(`[POLLING] Loaded ${viewModels.length} notifications (count: ${this.unreadCount()})`);
        console.log(`[POLLING] Badge count: ${this.unreadCount()}`);
      },
      error: (err) => {
        console.error('[DEBUG] ServiceNotificationService: Error', err);
        this.error.set('Failed to load notifications');
        this.logger.error('Error loading notifications');
      }
    });
  }
  
  refresh() {
    this.repository.refresh();
  }
  
  pausePolling() {
    this.repository.pausePolling();
  }
  
  resumePolling() {
    this.repository.resumePolling();
  }
}
