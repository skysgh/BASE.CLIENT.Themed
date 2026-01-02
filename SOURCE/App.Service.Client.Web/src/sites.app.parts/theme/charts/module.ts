/**
 * ApexCharts Reference Module
 * 
 * Showcases all ApexCharts chart types available in the theme.
 * Ported from Velzon Angular template for reference.
 * 
 * Routes:
 * - /system/theme/charts - Charts hub
 * - /system/theme/charts/line - Line charts
 * - /system/theme/charts/area - Area charts
 * - /system/theme/charts/bar - Bar charts
 * - /system/theme/charts/column - Column charts
 * - /system/theme/charts/pie - Pie charts
 * - /system/theme/charts/polar - Polar charts
 * - /system/theme/charts/radar - Radar charts
 * - /system/theme/charts/radialbar - Radial bar charts
 * - /system/theme/charts/scatter - Scatter charts
 * - /system/theme/charts/bubble - Bubble charts
 * - /system/theme/charts/heatmap - Heatmap charts
 * - /system/theme/charts/treemap - Treemap charts
 * - /system/theme/charts/boxplot - Box plot charts
 * - /system/theme/charts/candlestick - Candlestick charts
 * - /system/theme/charts/funnel - Funnel charts
 * - /system/theme/charts/mixed - Mixed charts
 * - /system/theme/charts/timeline - Timeline charts
 * - /system/theme/charts/range-area - Range area charts
 * - /system/theme/charts/slope - Slope charts
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./charts-hub/component').then(m => m.ChartsHubComponent)
  },
  {
    path: 'line',
    loadComponent: () => import('./line/component').then(m => m.LineChartComponent)
  },
  {
    path: 'area',
    loadComponent: () => import('./area/component').then(m => m.AreaChartComponent)
  },
  {
    path: 'bar',
    loadComponent: () => import('./bar/component').then(m => m.BarChartComponent)
  },
  {
    path: 'column',
    loadComponent: () => import('./column/component').then(m => m.ColumnChartComponent)
  },
  {
    path: 'pie',
    loadComponent: () => import('./pie/component').then(m => m.PieChartComponent)
  },
  {
    path: 'polar',
    loadComponent: () => import('./polar/component').then(m => m.PolarChartComponent)
  },
  {
    path: 'radar',
    loadComponent: () => import('./radar/component').then(m => m.RadarChartComponent)
  },
  {
    path: 'radialbar',
    loadComponent: () => import('./radialbar/component').then(m => m.RadialbarChartComponent)
  },
  {
    path: 'scatter',
    loadComponent: () => import('./scatter/component').then(m => m.ScatterChartComponent)
  },
  {
    path: 'bubble',
    loadComponent: () => import('./bubble/component').then(m => m.BubbleChartComponent)
  },
  {
    path: 'heatmap',
    loadComponent: () => import('./heatmap/component').then(m => m.HeatmapChartComponent)
  },
  {
    path: 'treemap',
    loadComponent: () => import('./treemap/component').then(m => m.TreemapChartComponent)
  },
  {
    path: 'boxplot',
    loadComponent: () => import('./boxplot/component').then(m => m.BoxplotChartComponent)
  },
  {
    path: 'candlestick',
    loadComponent: () => import('./candlestick/component').then(m => m.CandlestickChartComponent)
  },
  {
    path: 'funnel',
    loadComponent: () => import('./funnel/component').then(m => m.FunnelChartComponent)
  },
  {
    path: 'mixed',
    loadComponent: () => import('./mixed/component').then(m => m.MixedChartComponent)
  },
  {
    path: 'timeline',
    loadComponent: () => import('./timeline/component').then(m => m.TimelineChartComponent)
  },
  {
    path: 'range-area',
    loadComponent: () => import('./range-area/component').then(m => m.RangeAreaChartComponent)
  },
  {
    path: 'slope',
    loadComponent: () => import('./slope/component').then(m => m.SlopeChartComponent)
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ChartsModule {}
