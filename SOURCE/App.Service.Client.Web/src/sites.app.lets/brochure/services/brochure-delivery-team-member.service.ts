import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BrochureDeliveryTeamMemberRepository } from '../repositories/brochure-delivery-team-member.repository';
import { BrochureDeliveryTeamMemberViewModel } from '../models/view-models/brochure-delivery-team-member.view-model';
import { mapBrochureDeliveryTeamMemberDtosToViewModels } from '../mappers/brochure-delivery-team-member.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class BrochureDeliveryTeamMemberService {
  teamMembers = signal<BrochureDeliveryTeamMemberViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  memberCount = computed(() => this.teamMembers().length);
  hasMembers = computed(() => this.teamMembers().length > 0);
  enabledMembers = computed(() => this.teamMembers().filter(m => m.enabled));
  
  constructor(
    private repository: BrochureDeliveryTeamMemberRepository,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadTeamMembers();
  }
  
  loadTeamMembers() {
    this.loading.set(true);
    this.error.set(null);
    
    return this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = mapBrochureDeliveryTeamMemberDtosToViewModels(dtos);
          this.teamMembers.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} team members`);
        },
        error: () => {
          this.error.set('Failed to load team members');
          this.loading.set(false);
        }
      })
    ).subscribe();
  }
  
  getById(id: string): BrochureDeliveryTeamMemberViewModel | undefined {
    return this.teamMembers().find(m => m.id === id);
  }
  
  refresh() {
    this.loadTeamMembers();
  }
}
