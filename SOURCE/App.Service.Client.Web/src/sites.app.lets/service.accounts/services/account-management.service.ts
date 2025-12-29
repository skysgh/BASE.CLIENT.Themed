import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AccountRepository } from '../repositories/account.repository';
import { AccountViewModel } from '../models/view-models/account.view-model';
import { mapAccountDtosToViewModels, mapAccountViewModelToDto } from '../mappers/account.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

/**
 * Account Management Service
 * 
 * Business-level service for managing accounts/tenants.
 * Used for account CRUD operations in multi-tenant services.
 * 
 * Note: This is different from AccountService in core/ which handles
 * bootstrap-level account detection and configuration loading.
 */
@Injectable({ providedIn: 'root' })
export class AccountManagementService {
  accounts = signal<AccountViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  accountCount = computed(() => this.accounts().length);
  hasAccounts = computed(() => this.accounts().length > 0);
  enabledAccounts = computed(() => this.accounts().filter(a => a.enabled));
  
  constructor(
    private repository: AccountRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
  }
  
  loadAccounts() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapAccountDtosToViewModels(dtos);
          this.accounts.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} accounts`);
        },
        error: () => {
          this.error.set('Failed to load accounts');
          this.loading.set(false);
        }
      })
    ).subscribe();
  }
  
  getById(id: string): AccountViewModel | undefined {
    return this.accounts().find(a => a.id === id);
  }
  
  getByGuid(accountGuid: string): AccountViewModel | undefined {
    return this.accounts().find(a => a.accountGuid === accountGuid);
  }
  
  getByName(name: string): AccountViewModel | undefined {
    return this.accounts().find(a => a.name === name);
  }
  
  create(account: AccountViewModel) {
    const dto = mapAccountViewModelToDto(account);
    return this.repository.create(dto).pipe(
      tap({
        next: () => {
          this.loadAccounts(); // Refresh list
          this.logger.debug(`Created account: ${account.name}`);
        }
      })
    );
  }
  
  update(account: AccountViewModel) {
    const dto = mapAccountViewModelToDto(account);
    return this.repository.update(account.id, dto).pipe(
      tap({
        next: () => {
          this.accounts.update(all =>
            all.map(a => a.id === account.id ? account : a)
          );
          this.logger.debug(`Updated account: ${account.name}`);
        }
      })
    );
  }
  
  delete(id: string) {
    return this.repository.delete(id).pipe(
      tap({
        next: () => {
          this.accounts.update(all => all.filter(a => a.id !== id));
          this.logger.debug(`Deleted account: ${id}`);
        }
      })
    );
  }
  
  refresh() {
    this.loadAccounts();
  }
}
