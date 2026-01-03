// Rx:
//
// Import Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Import Module specific.components:
import { BaseCorePagesROComponent } from './components/_routeoutlet/component';
import { BaseCorePagesInformationModule } from './information/module';
import { BaseCorePagesLandingModule } from './landing/module';

import { BaseThemesV1Module } from '../../../themes/t1/module';

// Services:
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { BaseThemesModule } from '../../../themes/module';
// ✅ Import parent module to get access to its providers (tokens)
import { BaseCoreSitesModule } from '../../module';
// Configuration:
import { sitesConfiguration } from '../../configuration/implementation/sites.configuration';

@NgModule({
  declarations: [
    BaseCorePagesROComponent,
  ],
  providers: [
  ],
  imports: [
    CommonModule,

    // ✅ Import parent module FIRST to get token providers
    BaseCoreSitesModule,
    
    // Import Base of Upstream Column: Themes, which depends on Core.Ag:
    BaseThemesModule,
    
    RouterModule.forChild(
      [
        // Lazy load child feature modules
        { path: 'landing', loadChildren: () => import('./landing/module').then(m => m.BaseCorePagesLandingModule) },
        { path: 'information', loadChildren: () => import('./information/module').then(m => m.BaseCorePagesInformationModule) },
        // ✅ UPDATED: Signed-out now in auth-landing feature with proper structure
        { path: 'signed-out', loadComponent: () => import('../auth-landing/ui/pages/signed-out/component').then(m => m.SignedOutLandingComponent) },
      ]
    ),
    
    FormsModule,
    
    // Child Modules:
    BaseCorePagesLandingModule,
    BaseCorePagesInformationModule,
  ],
  exports: [
  ]
})
export class BaseCoreSitesFeaturesPagesModule {
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug("BasePagesModule.constructor()");
  }
}
