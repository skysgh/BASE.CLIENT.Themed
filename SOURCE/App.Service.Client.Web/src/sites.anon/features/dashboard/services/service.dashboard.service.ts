// Ag:
import { Injectable, computed } from '@angular/core';
// Services:
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';
// Describe applet (now in sites.app.parts):
import { ServiceDescribeStatsService } from '../../../../sites.app.parts/describe/services/service-describe-stats.service';

/**
 * Dashboard service for the anon site.
 * Delegates to ServiceDescribeStatsService.
 */
@Injectable({ providedIn: 'root' })
export class DashboardService {

  readonly stats = computed(() => this.statsService.stats());
  readonly loading = computed(() => this.statsService.loading());
  readonly error = computed(() => this.statsService.error());
  readonly enabledStats = computed(() => this.statsService.enabledStats());

  constructor(
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    private statsService: ServiceDescribeStatsService
  ) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`);
  }

  refresh(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.refresh()`);
    this.statsService.loadStats();
  }
}

















































































































































