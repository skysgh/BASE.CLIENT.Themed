import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ServiceDeliveryTeamMemberRepository } from '../repositories/service-delivery-team-member.repository';
import { ServiceDeliveryTeamMemberViewModel } from '../models/view-models/service-delivery-team-member.view-model';
import { mapServiceDeliveryTeamMemberDtosToViewModels } from '../mappers/service-delivery-team-member.mapper';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class ServiceDeliveryTeamMemberService {
  teamMembers = signal<ServiceDeliveryTeamMemberViewModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  memberCount = computed(() => this.teamMembers().length);
  hasMembers = computed(() => this.teamMembers().length > 0);
  enabledMembers = computed(() => 
    this.teamMembers().filter(member => member.enabled)
  );
  
  constructor(
    private repository: ServiceDeliveryTeamMemberRepository,
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
          const viewModels = mapServiceDeliveryTeamMemberDtosToViewModels(dtos);
          this.teamMembers.set(viewModels);
          this.loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} team members`);
        },
        error: (err) => {
          this.error.set('Failed to load team members');
          this.loading.set(false);
          this.logger.error(`Error loading team members: ${err?.message || err}`);
        }
      })
    ).subscribe();
  }
  
  getById(id: string): ServiceDeliveryTeamMemberViewModel | undefined {
    return this.teamMembers().find(member => member.id === id);
  }
  
  refresh() {
    this.loadTeamMembers();
  }
}
