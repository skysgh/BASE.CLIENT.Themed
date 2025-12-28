import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LiveRepositoryService } from './base/live-repository.service';
import { ServiceNotificationDto } from '../models/dtos/service-notification.dto';
import { SystemDiagnosticsTraceService } from '../services/system.diagnostics-trace.service';
import { SystemErrorService } from '../services/system.error.service';

@Injectable({ providedIn: 'root' })
export class ServiceNotificationRepository extends LiveRepositoryService<ServiceNotificationDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(
      http,
      '/api/rest/base_service_Notifications',
      logger,
      60, // Poll every 60 seconds
      errorService
    );
  }

  getUserNotifications(userFK: string): Observable<ServiceNotificationDto[]> {
    return this.query({ forUserFK: userFK });
  }
}
