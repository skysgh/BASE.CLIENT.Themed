import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LiveRepositoryService } from './base/live-repository.service';
import { SystemDiagnosticsTraceService } from '../services/system.diagnostics-trace.service';
import { SystemErrorService } from '../services/system.error.service';

/**
 * Example: Notification Repository with Auto-Refresh
 * 
 * Demonstrates the Live Repository pattern for data that needs
 * automatic synchronization with backend.
 * 
 * **Usage in Service:**
 * ```typescript
 * @Injectable({ providedIn: 'root' })
 * export class NotificationService {
 *   // Auto-updating notifications (polls every 30 seconds)
 *   notifications$ = this.repo.live$;
 *   
 *   constructor(private repo: NotificationRepository) {}
 *   
 *   // Force immediate refresh
 *   refresh() {
 *     this.repo.refresh();
 *   }
 *   
 *   // Pause when user isn't looking
 *   pauseUpdates() {
 *     this.repo.pausePolling();
 *   }
 * }
 * ```
 * 
 * **Usage in Component:**
 * ```typescript
 * @Component({...})
 * export class NotificationBellComponent {
 *   // Auto-updates every 30 seconds!
 *   notifications$ = this.notificationService.notifications$;
 *   
 *   constructor(public notificationService: NotificationService) {}
 * }
 * ```
 * 
 * **Template:**
 * ```html
 * <div *ngIf="notifications$ | async as notifications">
 *   <span>{{ notifications.length }}</span> new notifications
 * </div>
 * ```
 */
@Injectable({ providedIn: 'root' })
export class NotificationRepository extends LiveRepositoryService<NotificationDto> {
  
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    // Poll every 30 seconds
    super(http, '/api/notifications', logger, 30, errorService);
  }
}

/**
 * Notification DTO
 */
export interface NotificationDto {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
