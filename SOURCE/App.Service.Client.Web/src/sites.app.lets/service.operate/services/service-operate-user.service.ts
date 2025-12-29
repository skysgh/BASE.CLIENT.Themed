import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ServiceOperateUserRepository } from '../repositories/service-operate-user.repository';
import { ServiceOperateUserViewModel } from '../models/view-models/service-operate-user.view-model';
import { mapServiceOperateUserDtosToViewModels } from '../mappers/service-operate-user.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ServiceOperateUserService {
  users = signal<ServiceOperateUserViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  enabledUsers = computed(() => this.users().filter(u => u.enabled));
  userCount = computed(() => this.users().length);
  
  constructor(
    private repository: ServiceOperateUserRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadUsers();
  }
  
  loadUsers() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapServiceOperateUserDtosToViewModels(dtos);
          this.users.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} users`);
        },
        error: () => {
          this.error.set('Failed to load users');
          this.loading.set(false);
        }
      })
    ).subscribe();
  }
  
  getById(id: string): ServiceOperateUserViewModel | undefined {
    return this.users().find(u => u.id === id);
  }
  
  refresh() {
    this.loadUsers();
  }
}
