// Ag:
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// Configuration:
import { appletsSpikesConfiguration } from '../../../../../configuration/implementations/app.lets.spikes.configuration';
import { appsConfiguration } from '../../../../../../../sites.app/configuration/implementations/apps.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
import { SpikeService } from '../../../../../services/spike.service';
import { SpikeViewModel } from '../../../../../models/view-models/spike.view-model';


/**
 * Spike Insights Component (I in I-BREAST-D)
 * 
 * Reports and charts on the Spike aggregate dataset.
 * Provides analytics and insights rather than CRUD operations.
 * 
 * Charts might include:
 * - Spikes by status (pie)
 * - Spikes by category (bar)
 * - Effort: estimated vs actual (comparison bar)
 * - Due dates timeline (calendar/gantt)
 * - Priority distribution
 * - Completion trends over time
 */
@Component({
    selector: 'app-base-apps-spike-insights',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
export class BaseAppsSpikeInsightsComponent implements OnInit {
  public appsConfiguration = appsConfiguration;
  public appletConfiguration = appletsSpikesConfiguration;

  // Raw data for charts
  public spikes: SpikeViewModel[] = [];
  
  // Computed metrics
  public metrics = {
    total: 0,
    byStatus: {} as Record<string, number>,
    byCategory: {} as Record<string, number>,
    byPriority: {} as Record<number, number>,
    totalEstimatedEffort: 0,
    totalActualEffort: 0,
    overdueCount: 0,
    completedThisMonth: 0,
  };

  // Chart data (for when we add a chart library)
  public statusChartData: { label: string; value: number; color: string }[] = [];
  public priorityChartData: { label: string; value: number; color: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private defaultControllerServices: DefaultComponentServices,
    private spikeService: SpikeService
  ) {
    this.defaultControllerServices.diagnosticsTraceService.info("Insights:Constructor");
  }

  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.info("Insights:OnInit");
    
    // Get all spikes and compute metrics
    this.spikes = this.spikeService.spikes();
    this.computeMetrics();
  }

  /**
   * Compute aggregate metrics from spike data
   */
  private computeMetrics(): void {
    const spikes = this.spikes;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    this.metrics.total = spikes.length;

    // Reset accumulators
    this.metrics.byStatus = {};
    this.metrics.byCategory = {};
    this.metrics.byPriority = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    this.metrics.totalEstimatedEffort = 0;
    this.metrics.totalActualEffort = 0;
    this.metrics.overdueCount = 0;
    this.metrics.completedThisMonth = 0;

    for (const spike of spikes) {
      // Count by status (using extended data if available)
      const statusId = (spike as any).statusId || 'unknown';
      this.metrics.byStatus[statusId] = (this.metrics.byStatus[statusId] || 0) + 1;

      // Count by category
      const categoryId = (spike as any).categoryId || 'unknown';
      this.metrics.byCategory[categoryId] = (this.metrics.byCategory[categoryId] || 0) + 1;

      // Count by priority
      const priority = (spike as any).priority || 3;
      this.metrics.byPriority[priority] = (this.metrics.byPriority[priority] || 0) + 1;

      // Sum efforts
      this.metrics.totalEstimatedEffort += (spike as any).estimatedEffort || 0;
      this.metrics.totalActualEffort += (spike as any).actualEffort || 0;

      // Check overdue
      const dueDate = (spike as any).dueDate ? new Date((spike as any).dueDate) : null;
      if (dueDate && dueDate < now && statusId !== '4') { // Not completed
        this.metrics.overdueCount++;
      }

      // Check completed this month
      const completedDate = (spike as any).completedDate ? new Date((spike as any).completedDate) : null;
      if (completedDate && completedDate >= startOfMonth) {
        this.metrics.completedThisMonth++;
      }
    }

    // Build chart data
    this.buildChartData();
  }

  /**
   * Build chart-ready data structures
   */
  private buildChartData(): void {
    // Status chart
    const statusColors: Record<string, string> = {
      '1': '#6c757d', // Draft
      '2': '#299cdb', // In Progress
      '3': '#f7b84b', // Review
      '4': '#0ab39c', // Completed
      '5': '#f06548', // Cancelled
    };
    const statusLabels: Record<string, string> = {
      '1': 'Draft',
      '2': 'In Progress',
      '3': 'Review',
      '4': 'Completed',
      '5': 'Cancelled',
    };

    this.statusChartData = Object.entries(this.metrics.byStatus).map(([id, count]) => ({
      label: statusLabels[id] || id,
      value: count,
      color: statusColors[id] || '#6c757d',
    }));

    // Priority chart
    const priorityLabels = ['', 'Lowest', 'Low', 'Medium', 'High', 'Highest'];
    const priorityColors = ['', '#6c757d', '#299cdb', '#f7b84b', '#f06548', '#dc3545'];

    this.priorityChartData = Object.entries(this.metrics.byPriority)
      .filter(([_, count]) => count > 0)
      .map(([priority, count]) => ({
        label: priorityLabels[+priority] || `P${priority}`,
        value: count,
        color: priorityColors[+priority] || '#6c757d',
      }));
  }

  /**
   * Navigate to browse view
   */
  goToBrowse(): void {
    this.router.navigate(['../spikes'], { relativeTo: this.route });
  }

  /**
   * Navigate to add new spike
   */
  goToAdd(): void {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }
}
