import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from '../../../core/repositories/base/repository.service';
import { ServiceOperateNotificationDto } from '../models/dtos/service-operate-notification.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../../core/services/system.error.service';

@Injectable({ providedIn: 'root' })
export class ServiceOperateNotificationRepository extends RepositoryService<ServiceOperateNotificationDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_service_Notifications', logger, errorService);
  }

  getEnabled(): Observable<ServiceOperateNotificationDto[]> {
    return this.query({ enabled: true });
  }

  getUnread(): Observable<ServiceOperateNotificationDto[]> {
    return this.query({ read: false });
  }

  markAsRead(id: string): Observable<ServiceOperateNotificationDto> {
    return this.patch(id, { read: true });
  }
}
