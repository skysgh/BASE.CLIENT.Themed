// Base are define in a Module
// outside of the deployment module
// so that it can be imported by child/feature
// models later.

// Rx:
//
// Ag:
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Configuration:
import { appsConfiguration } from '../sites.app/configuration/implementations/apps.configuration';
// Services:
import { SystemDefaultServices } from '../core/services/system.default-services.service';

// Components:
//import { BaseAppsRouteComponent } from "./ui/_route/component";


const routes: Routes = [
  // Settings - Unified settings hub
  { 
    path: 'settings', 
    loadChildren: () => import('./features/settings/routes').then(m => m.settingsRoutes)
  },

  // Search - Universal search (Browse in BREAD)
  { 
    path: 'search', 
    loadChildren: () => import('../sites.app.lets/service.search/routes').then(m => m.searchRoutes)
  },

  // Compliance - Legal documents (Privacy, Terms, etc.)
  { 
    path: 'compliance', 
    loadChildren: () => import('../sites.app.lets/service.compliance/module').then(m => m.ServiceComplianceAppletModule)
  },

  // About - Service information, version, licenses (Creator → Distributor → Account)
  { 
    path: 'about', 
    loadChildren: () => import('../sites.app.lets/service.about/module').then(m => m.ServiceAboutModule)
  },

  // Payment Processing - Subscriptions, payment methods, transactions
  { 
    path: 'payment-processing', 
    loadChildren: () => import('../sites.app.lets/service.payment-processing/module').then(m => m.ServicePaymentProcessingModule)
  },

  // Theme - Theme reference (developer tool)
  { 
    path: 'theme', 
    loadChildren: () => import('../sites.app.lets/service.theme/module').then(m => m.ServiceThemeModule)
  },

  // Spike - Discovery app.let
  { 
    path: 'spike', 
    loadChildren: () => import('../sites.app.lets/spike/module').then(m => m.BaseAppsSpikeModule)
  },

  //{ path: 'spike', loadChildren: () => import('./spike/module').then(m => m.BaseAppsSpikeModule) , pathMatch:'prefix'},
  //{ path: 'education', loadChildren: () => import('./education/module').then(m => m.BaseAppsEducationModule), pathMatch: 'prefix' },

  // others applets
  //{ path: 'architecture', loadChildren: () => import('./architecture/module').then(m => m.ArchitectureModule) },
  //{ path: 'people', loadChildren: () => import('./people/module').then(m => m.BaseAppsPeopleModule) },
  //{ path: 'products', loadChildren: () => import('./products/module').then(m => m.BaseAppsProductsModule) },
  //{ path: 'places', loadChildren: () => import('./places/module').then(m => m.BaseAppsPlacesModule) },
  //{ path: 'participations', loadChildren: () => import('./places/module').then(m => m.BaseAppsParticipationsModule) },
  //{ path: 'assessments', loadChildren: () => import('./places/module').then(m => m.BaseAppsAssessmentsModule) },
  //{ path: 'progress', loadChildren: () => import('./places/module').then(m => m.BaseAppsProgressModule) },
  //{ path: 'achievements', loadChildren: () => import('./places/module').then(m => m.BaseAppsAchievementsModule) },
  { path: '', redirectTo:'spike', pathMatch: 'prefix' }
  // THere is no default app (it would be parent that would default to 'index' page. )
  //{ path: '**'  ,   }

];


@NgModule({
  declarations: [
  ],
  providers: [
  ],
  imports: [
    RouterModule.forChild(routes),
    //Can Remove: TranslateModule.forChild(),
  ],
  exports: [
    RouterModule
  ]
})

export class BaseAppsRoutingModule {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose applet configuration:
  //public appletConfiguration = ...
  constructor(private defaultServices: SystemDefaultServices) {
    this.defaultServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
  }
}
