import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SystemUserRepository } from '../repositories/system-user.repository';
import { SystemUserViewModel } from '../models/view-models/system-user.view-model';
import { mapSystemUserDtosToViewModels } from '../mappers/system-user.mapper';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class SystemUserService {
  users = signal<SystemUserViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  userCount = computed(() => this.users().length);
  hasUsers = computed(() => this.users().length > 0);
  
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
        error: (err) => {
          this.error.set('Failed to load users');
          this.loading.set(false);
          this.logger.error(`Error loading users: ${err?.message || err}`);
        }
      })
    ).subscribe();
  }
  
  getById(id: string): SystemUserViewModel | undefined {
    return this.users().find(user => user.id === id);
  }
  
  refresh() {
    this.loadUsers();
  }
}
