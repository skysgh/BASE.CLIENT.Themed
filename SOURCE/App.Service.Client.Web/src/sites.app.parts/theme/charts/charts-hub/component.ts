/**
 * Charts Hub Component
 * 
 * Gallery of all available ApexCharts chart types.
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface ChartType {
  id: string;
  name: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-charts-hub',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="page-title-box d-flex align-items-center justify-content-between">
            <h4 class="mb-0">
              <i class="bx bx-bar-chart-alt-2 me-2 text-primary"></i>
              ApexCharts Reference
            </h4>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a routerLink="/system/theme">Theme</a></li>
                <li class="breadcrumb-item active">Charts</li>
              </ol>
            </nav>
          </div>
          <p class="text-muted">
            Collection of ApexCharts chart types available in the theme. 
            Click any chart type to see examples and configuration options.
          </p>
        </div>
      </div>

      <!-- Chart Type Grid -->
      <div class="row g-4">
        @for (chart of chartTypes; track chart.id) {
          <div class="col-xl-3 col-lg-4 col-md-6">
            <div class="card h-100 chart-type-card">
              <div class="card-body text-center">
                <div class="chart-icon mb-3">
                  <i [class]="chart.icon + ' display-4 text-primary'"></i>
                </div>
                <h5 class="card-title mb-2">{{ chart.name }}</h5>
                <p class="card-text text-muted small mb-3">{{ chart.description }}</p>
                <a [routerLink]="['./', chart.id]" class="btn btn-soft-primary btn-sm">
                  View Examples
                  <i class="bx bx-right-arrow-alt ms-1"></i>
                </a>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .chart-type-card {
      transition: all 0.3s ease;
      cursor: pointer;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        
        .chart-icon i {
          transform: scale(1.1);
        }
      }
    }
    
    .chart-icon {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      i {
        transition: transform 0.3s ease;
      }
    }
  `]
})
export class ChartsHubComponent {
  chartTypes: ChartType[] = [
    { id: 'line', name: 'Line Charts', icon: 'bx bx-line-chart', description: 'Basic, stepline, gradient, and annotations' },
    { id: 'area', name: 'Area Charts', icon: 'bx bx-area', description: 'Basic, spline, stacked, and negative' },
    { id: 'bar', name: 'Bar Charts', icon: 'bx bx-bar-chart-alt-2', description: 'Horizontal bars, stacked, grouped' },
    { id: 'column', name: 'Column Charts', icon: 'bx bx-bar-chart', description: 'Vertical columns, stacked, grouped' },
    { id: 'pie', name: 'Pie Charts', icon: 'bx bx-pie-chart-alt-2', description: 'Pie, donut, monochrome, gradient' },
    { id: 'polar', name: 'Polar Charts', icon: 'bx bx-shape-circle', description: 'Polar area visualization' },
    { id: 'radar', name: 'Radar Charts', icon: 'bx bx-shape-polygon', description: 'Multi-axis spider charts' },
    { id: 'radialbar', name: 'Radial Bar', icon: 'bx bx-doughnut-chart', description: 'Circular progress gauges' },
    { id: 'scatter', name: 'Scatter Charts', icon: 'bx bx-scatter-chart', description: 'XY scatter plots' },
    { id: 'bubble', name: 'Bubble Charts', icon: 'bx bx-loader-circle', description: '3D bubble visualization' },
    { id: 'heatmap', name: 'Heatmap', icon: 'bx bx-grid', description: 'Color intensity grids' },
    { id: 'treemap', name: 'Treemap', icon: 'bx bx-sitemap', description: 'Hierarchical data rectangles' },
    { id: 'boxplot', name: 'Box Plot', icon: 'bx bx-customize', description: 'Statistical box and whisker' },
    { id: 'candlestick', name: 'Candlestick', icon: 'bx bx-candles', description: 'Financial OHLC charts' },
    { id: 'funnel', name: 'Funnel', icon: 'bx bx-filter', description: 'Conversion funnel visualization' },
    { id: 'mixed', name: 'Mixed Charts', icon: 'bx bx-intersect', description: 'Combination of chart types' },
    { id: 'timeline', name: 'Timeline', icon: 'bx bx-time-five', description: 'Gantt and range bars' },
    { id: 'range-area', name: 'Range Area', icon: 'bx bx-stats', description: 'Min-max range visualization' },
    { id: 'slope', name: 'Slope Charts', icon: 'bx bx-trending-up', description: 'Before/after comparisons' },
  ];
}
