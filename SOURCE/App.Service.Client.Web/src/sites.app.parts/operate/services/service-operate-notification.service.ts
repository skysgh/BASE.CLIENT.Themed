import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ServiceOperateNotificationRepository } from '../repositories/service-operate-notification.repository';
import { ServiceOperateNotificationViewModel } from '../models/view-models/service-operate-notification.view-model';
import { mapServiceOperateNotificationDtosToViewModels } from '../mappers/service-operate-notification.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ServiceOperateNotificationService {
  notifications = signal<ServiceOperateNotificationViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  // All notifications (for template compatibility)
  enabledNotifications = computed(() => this.notifications());
  
  // Unread notifications
  unreadNotifications = computed(() => this.notifications().filter(n => !n.isRead));
  unreadCount = computed(() => this.unreadNotifications().length);
  hasUnread = computed(() => this.unreadCount() > 0);
  
  constructor(
    private repository: ServiceOperateNotificationRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadNotifications();
  }
  
  loadNotifications() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapServiceOperateNotificationDtosToViewModels(dtos);
          this.notifications.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} notifications`);
        },
        error: () => {
          this.error.set('Failed to load notifications');
          this.loading.set(false);
        }
      })
    ).subscribe();
  }
  
  markAsRead(id: string) {
    return this.repository.markAsRead(id).pipe(
      tap({
        next: () => {
          this.notifications.update(all =>
            all.map(n => n.id === id ? { ...n, isRead: true } : n)
          );
        }
      })
    );
  }
  
  refresh() {
    this.loadNotifications();
  }
}
