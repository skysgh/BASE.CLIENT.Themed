import { Injectable, signal, computed } from '@angular/core';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StatementRepository } from '../repositories/statement.repository';
import { StatementTypeRepository } from '../repositories/statement-type.repository';
import { TextMediaEncodingTypeRepository } from '../repositories/text-media-encoding-type.repository';
import { StatementViewModel } from '../models/view-models/statement.view-model';
import { StatementTypeViewModel } from '../models/view-models/statement-type.view-model';
import { TextMediaEncodingTypeViewModel } from '../models/view-models/text-media-encoding-type.view-model';
import { mapStatementDtoToViewModel } from '../mappers/statement.mapper';
import { mapStatementTypeDtosToViewModels } from '../mappers/statement-type.mapper';
import { mapTextMediaEncodingTypeDtosToViewModels } from '../mappers/text-media-encoding-type.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

/**
 * Statement Service
 * 
 * Manages legal/compliance statements with support for:
 * - Service-level default statements
 * - Per-account statement overrides
 * - Multiple encoding types (PDF, HTML, Markdown)
 * - Multi-language support
 */
@Injectable({ providedIn: 'root' })
export class StatementService {
  statements = signal<StatementViewModel[]>([]);
  statementTypes = signal<StatementTypeViewModel[]>([]);
  encodingTypes = signal<TextMediaEncodingTypeViewModel[]>([]);
  
  loading = signal(false);
  error = signal<string | null>(null);
  
  // Computed
  effectiveStatements = computed(() => 
    this.statements().filter(s => s.isEffective && s.enabled)
  );
  
  privacyStatement = computed(() => 
    this.statements().find(s => s.typeCode === 'PRIVACY' && s.isEffective)
  );
  
  termsStatement = computed(() => 
    this.statements().find(s => s.typeCode === 'TERMS' && s.isEffective)
  );
  
  constructor(
    private statementRepo: StatementRepository,
    private typeRepo: StatementTypeRepository,
    private encodingRepo: TextMediaEncodingTypeRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
  }
  
  /**
   * Load all statement data (statements + reference types)
   */
  loadAll() {
    this.loading.set(true);
    this.error.set(null);
    
    return forkJoin({
      statements: this.statementRepo.getEnabled(),
      types: this.typeRepo.getEnabled(),
      encodings: this.encodingRepo.getEnabled()
    }).pipe(
      tap({
        next: (result) => {
          // Map types and encodings first
          const typeVMs = mapStatementTypeDtosToViewModels(result.types);
          const encodingVMs = mapTextMediaEncodingTypeDtosToViewModels(result.encodings);
          
          this.statementTypes.set(typeVMs);
          this.encodingTypes.set(encodingVMs);
          
          // Map statements with type/encoding info
          const statementVMs = result.statements.map(dto => {
            const type = typeVMs.find(t => t.id === dto.typeFK);
            const encoding = encodingVMs.find(e => e.id === dto.encodingTypeFK);
            return mapStatementDtoToViewModel(
              dto,
              type?.code ?? '',
              type?.name ?? '',
              encoding?.code ?? '',
              encoding?.name ?? '',
              encoding?.mimeType ?? ''
            );
          });
          
          this.statements.set(statementVMs);
          this.loading.set(false);
          this.logger.debug(`Loaded ${statementVMs.length} statements`);
        },
        error: () => {
          this.error.set('Failed to load compliance statements');
          this.loading.set(false);
        }
      })
    ).subscribe();
  }
  
  /**
   * Get effective statement for a type, considering account overrides
   */
  getEffectiveStatement(typeCode: string, accountId?: string): StatementViewModel | undefined {
    const statements = this.statements().filter(
      s => s.typeCode === typeCode && s.isEffective && s.enabled
    );
    
    if (accountId) {
      // Check for account-specific override first
      const accountStatement = statements.find(s => s.isAccountOverride);
      if (accountStatement) return accountStatement;
    }
    
    // Fall back to service-level statement
    return statements.find(s => !s.isAccountOverride);
  }
  
  /**
   * Get statement by ID
   */
  getById(id: string): StatementViewModel | undefined {
    return this.statements().find(s => s.id === id);
  }
  
  refresh() {
    this.loadAll();
  }
}
