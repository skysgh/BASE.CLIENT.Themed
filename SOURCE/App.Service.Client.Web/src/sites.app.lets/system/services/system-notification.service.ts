import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SystemNotificationRepository } from '../repositories/system-notification.repository';
import { SystemNotificationViewModel } from '../models/view-models/system-notification.view-model';
import { mapSystemNotificationDtosToViewModels } from '../mappers/system-notification.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class SystemNotificationService {
  notifications = signal<SystemNotificationViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  // All notifications (for template compatibility)
  enabledNotifications = computed(() => this.notifications());
  
  // Unread notifications
  unreadNotifications = computed(() => this.notifications().filter(n => !n.isRead));
  unreadCount = computed(() => this.unreadNotifications().length);
  hasUnread = computed(() => this.unreadCount() > 0);
  
  constructor(
    private repository: SystemNotificationRepository,
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
          const viewModels = mapSystemNotificationDtosToViewModels(dtos);
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
