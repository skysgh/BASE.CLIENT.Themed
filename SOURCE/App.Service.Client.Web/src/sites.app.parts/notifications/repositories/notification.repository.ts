/**
 * Notification Repository
 * 
 * API communication for notifications.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from '../../../core/repositories/base/repository.service';
import { NotificationDto } from '../models/notification.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../../core/services/system.error.service';

@Injectable({ providedIn: 'root' })
export class NotificationRepository extends RepositoryService<NotificationDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_service_Notifications', logger, errorService);
  }

  /** Get enabled notifications */
  getEnabled(): Observable<NotificationDto[]> {
    return this.query({ enabled: true });
  }

  /** Get unread notifications */
  getUnread(): Observable<NotificationDto[]> {
    return this.query({ read: false });
  }

  /** Mark notification as read */
  markAsRead(id: string): Observable<NotificationDto> {
    return this.patch(id, { read: true });
  }

  /** Mark all notifications as read */
  markAllAsRead(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/mark-all-read`, {});
  }
}
