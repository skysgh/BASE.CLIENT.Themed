/**
 * Domain Applets Routing Module
 * 
 * Routes for /apps/* - domain-specific applets.
 * These are the main business features that users came for.
 * 
 * Route Structure:
 * - /apps/spike      → Discovery/development applet
 * - /apps/catalog    → Product catalog (future)
 * - /apps/orders     → Order management (future)
 * - /apps/people     → People management (future)
 * 
 * Note: Platform parts (/system/*) are now separate.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // ============================================================================
  // DOMAIN APPLETS
  // What users came for - business domain features
  // ============================================================================

  // Spike - Discovery/development applet
  { 
    path: 'spike', 
    loadChildren: () => import('./spike/module').then(m => m.BaseAppsSpikeModule)
  },

  // FAQ - Frequently Asked Questions
  { 
    path: 'faq', 
    loadChildren: () => import('./faq/module').then(m => m.FaqModule)
  },

  // Surveys - Configurable surveys with conditional branching
  { 
    path: 'surveys', 
    loadChildren: () => import('./surveys/module').then(m => m.SurveysModule)
  },

  // ============================================================================
  // FUTURE DOMAIN APPLETS
  // ============================================================================
  
  // { path: 'people', loadChildren: () => import('./people/module').then(m => m.PeopleModule) },
  // { path: 'catalog', loadChildren: () => import('./catalog/module').then(m => m.CatalogModule) },
  // { path: 'orders', loadChildren: () => import('./orders/module').then(m => m.OrdersModule) },

  // ============================================================================
  // DEFAULT - redirect to first applet
  // ============================================================================
  { path: '', redirectTo: 'spike', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppletsRoutingModule { }
