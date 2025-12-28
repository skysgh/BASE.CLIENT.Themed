import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SystemUserRepository } from '../repositories/system-user.repository';
import { SystemUserViewModel } from '../models/view-models/system-user.view-model';
import { mapSystemUserDtosToViewModels } from '../mappers/system-user.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class SystemUserService {
  users = signal<SystemUserViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  enabledUsers = computed(() => this.users().filter(u => u.enabled));
  userCount = computed(() => this.users().length);
  
  constructor(
    private repository: SystemUserRepository,
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
          const viewModels = mapSystemUserDtosToViewModels(dtos);
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
  
  getById(id: string): SystemUserViewModel | undefined {
    return this.users().find(u => u.id === id);
  }
  
  refresh() {
    this.loadUsers();
  }
}
