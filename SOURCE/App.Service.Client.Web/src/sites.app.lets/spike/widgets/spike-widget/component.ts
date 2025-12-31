// Ag:
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
// Services:
import { SpikeService } from '../../services/spike.service';
import { SpikeViewModel } from '../../models/view-models/spike.view-model';

/**
 * Spike Dashboard Widget Component (D in I-BREAST-D)
 * 
 * A small, embeddable summary card for dashboards.
 * Shows key metrics at a glance with link to full view.
 * 
 * Usage:
 * <app-spike-widget></app-spike-widget>
 * <app-spike-widget [size]="'lg'" [showChart]="true"></app-spike-widget>
 */
@Component({
    selector: 'app-spike-widget',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
export class SpikeDashboardWidgetComponent implements OnInit {
  
  /** Widget size: sm (compact), md (default), lg (expanded with chart) */
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  
  /** Show mini chart */
  @Input() showChart = false;
  
  /** Widget title override */
  @Input() title = 'Spikes';

  // Metrics
  total = 0;
  inProgress = 0;
  overdue = 0;
  completedRecently = 0;

  constructor(
    private spikeService: SpikeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.computeMetrics();
  }

  private computeMetrics(): void {
    const spikes = this.spikeService.spikes();
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    this.total = spikes.length;
    this.inProgress = spikes.filter((s: SpikeViewModel) => (s as any).statusId === '2').length;
    this.overdue = spikes.filter((s: SpikeViewModel) => {
      const due = (s as any).dueDate ? new Date((s as any).dueDate) : null;
      return due && due < now && (s as any).statusId !== '4';
    }).length;
    this.completedRecently = spikes.filter((s: SpikeViewModel) => {
      const completed = (s as any).completedDate ? new Date((s as any).completedDate) : null;
      return completed && completed >= weekAgo;
    }).length;
  }

  goToSpikes(): void {
    this.router.navigate(['/apps/spike/spikes']);
  }

  goToInsights(): void {
    this.router.navigate(['/apps/spike/insights']);
  }

  goToAdd(): void {
    this.router.navigate(['/apps/spike/add']);
  }
}
