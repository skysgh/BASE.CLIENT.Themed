/**
 * Theme T1 Developer Reference Routing
 * 
 * Nested route structure for theme reference pages.
 * All reference modules are lazy-loaded.
 * 
 * Path: /dev/theme/t1/minimal/...
 * 
 * Route behavior:
 * - /dev/theme/t1           → redirects to /dev/theme/t1/minimal
 * - /dev/theme/t1/minimal   → shows MinimalHubComponent (index of all reference)
 * - /dev/theme/t1/minimal/icons → icons reference pages
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { T1DevHubComponent } from './ui/views/dev-hub/component';

const routes: Routes = [
  // Root redirect to minimal variant
  {
    path: '',
    redirectTo: 'minimal',
    pathMatch: 'full'
  },

  // Velzon "Minimal" variant reference pages
  // Each module is lazy-loaded for performance
  {
    path: 'minimal',
    children: [
      // Hub - shows index of all reference modules
      {
        path: '',
        component: T1DevHubComponent,
        pathMatch: 'full'
      },

      // Icons Reference
      {
        path: 'icons',
        loadChildren: () => import('./reference/icons/module').then(m => m.IconsReferenceModule)
      },

      // UI Components Reference
      {
        path: 'ui',
        loadChildren: () => import('./reference/ui/module').then(m => m.UiReferenceModule)
      },

      // Charts Reference
      {
        path: 'charts',
        loadChildren: () => import('./reference/charts/module').then(m => m.ChartsReferenceModule)
      },

      // Forms Reference
      {
        path: 'forms',
        loadChildren: () => import('./reference/forms/module').then(m => m.FormsReferenceModule)
      },

      // Tables Reference
      {
        path: 'tables',
        loadChildren: () => import('./reference/tables/module').then(m => m.TablesReferenceModule)
      },

      // Maps Reference
      {
        path: 'maps',
        loadChildren: () => import('./reference/maps/module').then(m => m.MapsReferenceModule)
      },
    ]
  },

  // Future: Other Velzon variants
  // {
  //   path: 'default',
  //   children: [...]
  // },
  // {
  //   path: 'material',
  //   children: [...]
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class T1DevRoutingModule { }
