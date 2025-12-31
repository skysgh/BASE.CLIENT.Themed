import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ServiceDescribeDeliveryTeamMemberRepository } from '../repositories/service-describe-delivery-team-member.repository';
import { ServiceDescribeDeliveryTeamMemberViewModel } from '../models/view-models/service-describe-delivery-team-member.view-model';
import { mapServiceDescribeDeliveryTeamMemberDtosToViewModels } from '../mappers/service-describe-delivery-team-member.mapper';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ServiceDescribeDeliveryTeamMemberService {
  teamMembers = signal<ServiceDescribeDeliveryTeamMemberViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  memberCount = computed(() => this.teamMembers().length);
  hasMembers = computed(() => this.teamMembers().length > 0);
  enabledMembers = computed(() => this.teamMembers().filter(m => m.enabled));
  
  constructor(
    private repository: ServiceDescribeDeliveryTeamMemberRepository,
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
          const viewModels = mapServiceDescribeDeliveryTeamMemberDtosToViewModels(dtos);
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
  
  getById(id: string): ServiceDescribeDeliveryTeamMemberViewModel | undefined {
    return this.teamMembers().find(m => m.id === id);
  }
  
  refresh() {
    this.loadTeamMembers();
  }
}
