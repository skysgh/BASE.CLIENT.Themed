// Ag:
import { Injectable, computed } from '@angular/core';
// Services:
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';
import { BrochureStatsService } from '../../../../sites.app.lets/brochure/services/brochure-stats.service';

/**
 * Dashboard service for the anon site.
 * Delegates to BrochureStatsService.
 */
@Injectable({ providedIn: 'root' })
export class DashboardService {

  readonly stats = computed(() => this.statsService.stats());
  readonly loading = computed(() => this.statsService.loading());
  readonly error = computed(() => this.statsService.error());
  readonly enabledStats = computed(() => this.statsService.enabledStats());

  constructor(
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    private statsService: BrochureStatsService
  ) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`);
  }

  refresh(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.refresh()`);
    this.statsService.loadStats();
  }
}



