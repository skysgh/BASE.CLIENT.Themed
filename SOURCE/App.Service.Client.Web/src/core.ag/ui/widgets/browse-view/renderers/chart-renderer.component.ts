/**
 * Chart Renderer Component
 * 
 * Renders aggregated data as charts using ApexCharts.
 * Takes card data and chart definition, aggregates, and displays.
 */
import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';

import { IUniversalCardData } from '../../../../../core/models/presentation/universal-card.model';
import { 
  ChartDefinition, 
  ChartData, 
  aggregateForChart 
} from '../../../../../core/models/query/chart-definition.model';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexXAxis,
  ApexYAxis,
  ApexFill,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexTooltip,
  ApexStroke,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  fill: ApexFill;
  legend: ApexLegend;
  responsive: ApexResponsive[];
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  colors: string[];
  labels: string[];
};

@Component({
  selector: 'app-chart-renderer',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="chart-renderer">
      @if (chartData && chartOptions) {
        <div class="chart-header mb-3">
          <h6 class="mb-1">{{ chartDefinition.label }}</h6>
          <small class="text-muted">
            Based on {{ chartData.totalCount }} {{ chartData.totalCount === 1 ? 'item' : 'items' }}
          </small>
        </div>
        
        <div class="chart-container">
          <apx-chart
            [series]="chartOptions.series!"
            [chart]="chartOptions.chart!"
            [dataLabels]="chartOptions.dataLabels!"
            [plotOptions]="chartOptions.plotOptions!"
            [xaxis]="chartOptions.xaxis!"
            [yaxis]="chartOptions.yaxis!"
            [fill]="chartOptions.fill!"
            [legend]="chartOptions.legend!"
            [colors]="chartOptions.colors!"
            [labels]="chartOptions.labels!"
            [stroke]="chartOptions.stroke!"
            [tooltip]="chartOptions.tooltip!"
            [responsive]="chartOptions.responsive!">
          </apx-chart>
        </div>
      } @else {
        <div class="chart-empty text-center py-5">
          <i class="bx bx-bar-chart-alt-2 display-1 text-muted"></i>
          <h5 class="mt-3 text-muted">No chart data available</h5>
          <p class="text-muted small">Select a chart type to visualize the data</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .chart-renderer {
      padding: 1rem;
      background: white;
      border-radius: 0.5rem;
      border: 1px solid var(--vz-border-color);
    }
    
    .chart-header {
      h6 {
        font-weight: 600;
      }
    }
    
    .chart-container {
      min-height: 300px;
    }
    
    .chart-empty {
      opacity: 0.7;
    }
  `]
})
export class ChartRendererComponent implements OnChanges {
  @Input() cards: IUniversalCardData[] = [];
  @Input() chartDefinition!: ChartDefinition;
  
  chartData: ChartData | null = null;
  chartOptions: Partial<ChartOptions> | null = null;
  
  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['cards'] || changes['chartDefinition']) && this.chartDefinition) {
      this.updateChart();
    }
  }
  
  private updateChart(): void {
    if (!this.chartDefinition || this.cards.length === 0) {
      this.chartData = null;
      this.chartOptions = null;
      return;
    }
    
    // Aggregate data
    this.chartData = aggregateForChart(
      this.cards,
      this.chartDefinition,
      (card, field) => this.getFieldValue(card, field)
    );
    
    // Build chart options
    this.chartOptions = this.buildChartOptions(this.chartData);
  }
  
  private getFieldValue(card: IUniversalCardData, field: string): any {
    // Check direct properties
    if (field === 'title') return card.title;
    if (field === 'subtitle') return card.subtitle;
    if (field === 'status') return card.status?.label;
    
    // Check cells
    const cell = card.cells?.find(c => 
      c.label.toLowerCase() === field.toLowerCase() ||
      c.label.toLowerCase().replace(/\s+/g, '') === field.toLowerCase()
    );
    if (cell) return cell.value;
    
    // Check payload
    if (card.payload && field in card.payload) {
      return (card.payload as any)[field];
    }
    
    return undefined;
  }
  
  private buildChartOptions(data: ChartData): Partial<ChartOptions> {
    const { definition, categories, values } = data;
    
    const baseColors = [
      '#405189', '#0ab39c', '#f06548', '#f7b84b', '#299cdb',
      '#6559cc', '#3577f1', '#02a8b5', '#e83e8c', '#fd7e14'
    ];
    
    const colors = definition.colors || baseColors;
    
    // Common options
    const commonOptions = {
      colors,
      dataLabels: {
        enabled: definition.showDataLabels ?? true,
      },
      legend: {
        position: 'bottom' as const,
        horizontalAlign: 'center' as const,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: '100%' },
            legend: { position: 'bottom' },
          },
        },
      ],
      tooltip: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth' as const,
        width: 2,
      },
    };
    
    // Chart type specific options
    switch (definition.type) {
      case 'pie':
      case 'donut':
        return {
          ...commonOptions,
          series: values as ApexNonAxisChartSeries,
          labels: categories,
          chart: {
            type: definition.type,
            height: 350,
          },
          plotOptions: {
            pie: {
              donut: {
                size: definition.type === 'donut' ? '65%' : '0%',
              },
            },
          },
        } as Partial<ChartOptions>;
      
      case 'line':
      case 'area':
        return {
          ...commonOptions,
          series: [{
            name: definition.valueLabel || 'Count',
            data: values!,
          }] as ApexAxisChartSeries,
          chart: {
            type: definition.type,
            height: 350,
            toolbar: { show: true },
          },
          xaxis: {
            categories,
          },
          yaxis: {
            title: { text: definition.valueLabel || 'Count' },
          },
          fill: {
            type: definition.type === 'area' ? 'gradient' : 'solid',
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.7,
              opacityTo: 0.3,
            },
          },
          plotOptions: {},
          labels: [],
        } as Partial<ChartOptions>;
      
      case 'bar':
      case 'column':
      default:
        return {
          ...commonOptions,
          series: [{
            name: definition.valueLabel || 'Count',
            data: values!,
          }] as ApexAxisChartSeries,
          chart: {
            type: 'bar',
            height: 350,
            toolbar: { show: true },
          },
          plotOptions: {
            bar: {
              horizontal: definition.type === 'bar',
              columnWidth: '55%',
              borderRadius: 4,
            },
          },
          xaxis: {
            categories,
          },
          yaxis: {
            title: { text: definition.valueLabel || 'Count' },
          },
          fill: {
            type: 'solid',
          },
          labels: [],
        } as Partial<ChartOptions>;
    }
  }
}
