/**
 * ApexCharts Reference Module
 * 
 * Showcases all ApexCharts chart types available in the theme.
 * Ported from Velzon Angular template for reference.
 * 
 * TODO: Copy chart components from Velzon theme:
 * - sites.app.dev/reference/charts/Apexcharts/*
 * 
 * Routes:
 * - /system/theme/charts - Charts hub
 * - /system/theme/charts/line - Line charts
 * - /system/theme/charts/area - Area charts
 * - ... (19 chart types total)
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./charts-hub/component').then(m => m.ChartsHubComponent)
  },
  // NOTE: Individual chart type routes are commented out until components are copied from Velzon.
  // To add a chart type:
  // 1. Copy from sites.app.dev/reference/charts/Apexcharts/{type}/
  // 2. Adapt to standalone component pattern
  // 3. Uncomment route below
  
  // { path: 'line', loadComponent: () => import('./line/component').then(m => m.LineChartComponent) },
  // { path: 'area', loadComponent: () => import('./area/component').then(m => m.AreaChartComponent) },
  // { path: 'bar', loadComponent: () => import('./bar/component').then(m => m.BarChartComponent) },
  // { path: 'column', loadComponent: () => import('./column/component').then(m => m.ColumnChartComponent) },
  // { path: 'pie', loadComponent: () => import('./pie/component').then(m => m.PieChartComponent) },
  // { path: 'polar', loadComponent: () => import('./polar/component').then(m => m.PolarChartComponent) },
  // { path: 'radar', loadComponent: () => import('./radar/component').then(m => m.RadarChartComponent) },
  // { path: 'radialbar', loadComponent: () => import('./radialbar/component').then(m => m.RadialbarChartComponent) },
  // { path: 'scatter', loadComponent: () => import('./scatter/component').then(m => m.ScatterChartComponent) },
  // { path: 'bubble', loadComponent: () => import('./bubble/component').then(m => m.BubbleChartComponent) },
  // { path: 'heatmap', loadComponent: () => import('./heatmap/component').then(m => m.HeatmapChartComponent) },
  // { path: 'treemap', loadComponent: () => import('./treemap/component').then(m => m.TreemapChartComponent) },
  // { path: 'boxplot', loadComponent: () => import('./boxplot/component').then(m => m.BoxplotChartComponent) },
  // { path: 'candlestick', loadComponent: () => import('./candlestick/component').then(m => m.CandlestickChartComponent) },
  // { path: 'funnel', loadComponent: () => import('./funnel/component').then(m => m.FunnelChartComponent) },
  // { path: 'mixed', loadComponent: () => import('./mixed/component').then(m => m.MixedChartComponent) },
  // { path: 'timeline', loadComponent: () => import('./timeline/component').then(m => m.TimelineChartComponent) },
  // { path: 'range-area', loadComponent: () => import('./range-area/component').then(m => m.RangeAreaChartComponent) },
  // { path: 'slope', loadComponent: () => import('./slope/component').then(m => m.SlopeChartComponent) },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ChartsModule {}
