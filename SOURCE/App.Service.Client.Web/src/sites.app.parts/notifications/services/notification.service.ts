/**
 * Notification Service
 * 
 * Business logic for notifications with reactive state.
 */
import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationViewModel } from '../models/notification.view-model';
import { mapNotificationDtosToViewModels } from '../mappers/notification.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  // State
  notifications = signal<NotificationViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  // Computed - compatibility with old service
  enabledNotifications = computed(() => this.notifications());
  unreadNotifications = computed(() => this.notifications().filter(n => !n.isRead));
  unreadCount = computed(() => this.unreadNotifications().length);
  hasUnread = computed(() => this.unreadCount() > 0);
  
  // Recent notifications for dropdown
  recentNotifications = computed(() => this.notifications().slice(0, 5));
  
  constructor(
    private repository: NotificationRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadNotifications();
  }
  
  /** Load all notifications */
  loadNotifications(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapNotificationDtosToViewModels(dtos);
          this.notifications.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} notifications`);
        },
        error: (err) => {
          this.error.set('Failed to load notifications');
          this.loading.set(false);
          this.logger.error(`Failed to load notifications: ${err.message}`);
        }
      })
    ).subscribe();
  }
  
  /** Mark a notification as read */
  markAsRead(id: string): void {
    this.repository.markAsRead(id).pipe(
      tap({
        next: () => {
          this.notifications.update(all =>
            all.map(n => n.id === id ? { ...n, isRead: true } : n)
          );
        }
      })
    ).subscribe();
  }
  
  /** Mark all notifications as read */
  markAllAsRead(): void {
    this.repository.markAllAsRead().pipe(
      tap({
        next: () => {
          this.notifications.update(all =>
            all.map(n => ({ ...n, isRead: true }))
          );
        }
      })
    ).subscribe();
  }
  
  /** Refresh notifications */
  refresh(): void {
    this.loadNotifications();
  }
}
